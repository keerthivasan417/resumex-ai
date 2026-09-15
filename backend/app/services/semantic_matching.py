"""Supplement deterministic matching with thresholded pgvector retrieval."""

from dataclasses import dataclass
from typing import Iterable

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.core import JobRequirement, Resume, TextVector
from app.services.embeddings import LocalEmbeddingService
from app.repositories.vector_repository import VectorRepository


@dataclass(frozen=True)
class SemanticChunkMatch:
    """A retrieved resume section chunk and its cosine similarity."""

    vector: TextVector
    similarity: float


@dataclass(frozen=True)
class SemanticRequirementMatch:
    """Semantic retrieval outcome for one requirement."""

    requirement: JobRequirement
    similarity: float
    chunks: tuple[SemanticChunkMatch, ...]


class SemanticMatchingService:
    """Retrieve candidate resume chunks relevant to a job requirement."""

    def __init__(
        self,
        embedding_service: LocalEmbeddingService | None = None,
        vector_repository: VectorRepository | None = None,
    ) -> None:
        self.embedding_service = embedding_service or LocalEmbeddingService()
        self.vector_repository = vector_repository or VectorRepository()

    def match_requirements(
        self, db: Session, requirements: Iterable[JobRequirement], resume: Resume, *, limit: int = 3
    ) -> list[SemanticRequirementMatch]:
        """Search only this resume's indexed sections for each requirement."""
        section_ids = [section.id for section in resume.sections]
        evidence_ids = [
            evidence.id
            for resume_skill in resume.skill_intelligence
            for evidence in resume_skill.evidence
        ]
        results: list[SemanticRequirementMatch] = []
        for requirement in requirements:
            query_embedding = self.embedding_service.embed(requirement.description)
            rows = self.vector_repository.search_cosine(
                db, query_embedding, entity_type="resume_section", entity_ids=section_ids, limit=limit
            )
            if evidence_ids:
                rows.extend(
                    self.vector_repository.search_cosine(
                        db, query_embedding, entity_type="skill_evidence", entity_ids=evidence_ids, limit=limit
                    )
                )
            chunks = tuple(
                SemanticChunkMatch(vector=vector, similarity=max(0.0, min(1.0, 1.0 - distance)))
                for vector, distance in sorted(rows, key=lambda item: item[1])[:limit]
            )
            results.append(SemanticRequirementMatch(requirement, chunks[0].similarity if chunks else 0.0, chunks))
        return results


def semantic_credit(similarity: float) -> float:
    """Only similarities at or above threshold contribute a normalized semantic credit."""
    threshold = settings.semantic_similarity_threshold
    if similarity < threshold or threshold >= 1:
        return 0.0
    return (similarity - threshold) / (1 - threshold)
