"""Tests for thresholded semantic retrieval and combined explainable scoring."""

from types import SimpleNamespace
from uuid import uuid4

from app.models.core import RequirementImportance, SkillEvidenceStatus
from app.services.job_matching import (
    RequirementAlignment,
    calculate_combined_match_score,
    final_requirement_decision,
)
from app.services.semantic_indexing import SemanticIndexService
from app.services.semantic_matching import SemanticMatchingService, SemanticRequirementMatch, semantic_credit


def _requirement(importance: RequirementImportance = RequirementImportance.REQUIRED):
    return SimpleNamespace(id=uuid4(), importance=importance, description="Python API experience")


def _alignment(requirement, credit: float, status: str = "unsupported"):
    return RequirementAlignment(requirement, status, None, (), credit, "Deterministic explanation.")


def test_semantic_threshold_normalizes_only_qualifying_similarity() -> None:
    """Below-threshold similarity contributes no semantic credit."""
    assert semantic_credit(0.64) == 0.0
    assert round(semantic_credit(0.825), 4) == 0.5


def test_semantic_retrieval_uses_fake_embeddings_and_candidate_section_filter() -> None:
    """Matching searches only vectors belonging to the requested resume sections."""
    requirement = _requirement()
    section_id = uuid4()
    vector = SimpleNamespace(id=uuid4(), source_section_id=section_id, chunk_text="Built Python APIs.")

    class _Embeddings:
        def embed(self, text: str) -> list[float]:
            assert text == requirement.description
            return [0.1, 0.2]

    class _Repository:
        def search_cosine(self, db, embedding, **kwargs):
            assert embedding == [0.1, 0.2]
            assert kwargs["entity_type"] == "resume_section"
            assert kwargs["entity_ids"] == [section_id]
            return [(vector, 0.2)]

    resume = SimpleNamespace(sections=[SimpleNamespace(id=section_id)], skill_intelligence=[])
    matches = SemanticMatchingService(_Embeddings(), _Repository()).match_requirements(None, [requirement], resume)  # type: ignore[arg-type]

    assert matches[0].similarity == 0.8
    assert matches[0].chunks[0].vector.chunk_text == "Built Python APIs."


def test_semantic_signal_supplements_but_does_not_override_evidence_match() -> None:
    """Semantic chunks can make an absent skill partial, while strong evidence stays matched."""
    requirement = _requirement()
    semantic = SemanticRequirementMatch(requirement, 0.9, ())

    assert final_requirement_decision(_alignment(requirement, 0.0), semantic) == "partially_supported"
    assert final_requirement_decision(_alignment(requirement, 1.0, "matched"), semantic) == "matched"


def test_combined_score_preserves_required_preferred_weights() -> None:
    """Evidence and semantic credits are combined before existing importance weighting."""
    required = _requirement(RequirementImportance.REQUIRED)
    preferred = _requirement(RequirementImportance.PREFERRED)
    required_semantic = SemanticRequirementMatch(required, 1.0, ())
    preferred_semantic = SemanticRequirementMatch(preferred, 0.0, ())

    score = calculate_combined_match_score(
        [_alignment(required, 1.0, "matched"), _alignment(preferred, 0.0)],
        [required_semantic, preferred_semantic],
    )

    assert score == 75.0


def test_indexing_replaces_each_entity_instead_of_accumulating_chunks() -> None:
    """Re-indexing sends one replacement batch per source entity."""
    calls = []

    class _Store:
        def replace_entity_texts(self, db, payloads):
            calls.append(payloads)
            return []

    section = SimpleNamespace(id=uuid4(), content="Python experience")
    resume = SimpleNamespace(sections=[section])
    SemanticIndexService(_Store()).index_resume(None, resume)  # type: ignore[arg-type]

    assert len(calls) == 1
    assert calls[0][0].entity_type == "resume_section"
    assert calls[0][0].entity_id == section.id


def test_repeated_indexing_uses_replacement_for_resume_and_job_entities() -> None:
    """Repeated screening indexes both source types through their scoped replacement path."""
    calls = []

    class _Store:
        def replace_entity_texts(self, db, payloads):
            calls.append((payloads[0].entity_type, payloads[0].entity_id, payloads[0].chunk_index))
            return []

    section = SimpleNamespace(id=uuid4(), content="Python experience")
    requirement = SimpleNamespace(id=uuid4(), description="Python API experience")
    resume = SimpleNamespace(sections=[section], skill_intelligence=[])
    job = SimpleNamespace(requirements=[requirement])
    service = SemanticIndexService(_Store())

    service.index_resume(None, resume)  # type: ignore[arg-type]
    service.index_job(None, job)  # type: ignore[arg-type]
    service.index_resume(None, resume)  # type: ignore[arg-type]
    service.index_job(None, job)  # type: ignore[arg-type]

    assert calls == [
        ("resume_section", section.id, 0),
        ("job_requirement", requirement.id, 0),
        ("resume_section", section.id, 0),
        ("job_requirement", requirement.id, 0),
    ]
