"""Tests for pgvector persistence and cosine-search statement construction."""

from types import SimpleNamespace
from uuid import uuid4

from app.repositories.vector_repository import VectorRepository
from app.schemas.vector import TextVectorCreate


class _FakeResult:
    def __init__(self, rows: list[tuple[object, float]]) -> None:
        self.rows = rows

    def all(self) -> list[tuple[object, float]]:
        return self.rows


class _FakeSession:
    def __init__(self) -> None:
        self.added: list[object] = []
        self.statement: object | None = None

    def add(self, instance: object) -> None:
        self.added.append(instance)

    def flush(self) -> None:
        pass

    def execute(self, statement: object) -> _FakeResult:
        self.statement = statement
        return _FakeResult([(SimpleNamespace(id=uuid4()), 0.125)])


class _ReplacementSession:
    def __init__(self) -> None:
        self.vectors: list[object] = []
        self.deleted: list[object] = []

    def scalars(self, statement: object) -> list[object]:
        return self.vectors

    def add(self, instance: object) -> None:
        self.vectors.append(instance)

    def delete(self, instance: object) -> None:
        self.deleted.append(instance)
        self.vectors.remove(instance)

    def flush(self) -> None:
        pass


def test_vector_repository_persists_generic_chunk() -> None:
    """Vector storage is generic across entity types and preserves source section metadata."""
    repository = VectorRepository()
    db = _FakeSession()
    payload = TextVectorCreate(
        entity_type="resume_section",
        entity_id=uuid4(),
        source_section_id=uuid4(),
        chunk_index=0,
        chunk_text="Built Python APIs.",
    )

    vector = repository.create(db, payload, [0.0, 0.1, 0.2])  # type: ignore[arg-type]

    assert db.added == [vector]
    assert vector.entity_type == "resume_section"
    assert vector.chunk_text == "Built Python APIs."


def test_vector_repository_builds_cosine_search_with_optional_filter() -> None:
    """Cosine search returns ordered rows and applies an entity-type filter when requested."""
    repository = VectorRepository()
    db = _FakeSession()

    results = repository.search_cosine(db, [0.0, 0.1, 0.2], entity_type="job", limit=5)  # type: ignore[arg-type]

    assert results[0][1] == 0.125
    assert db.statement is not None
    assert "text_vectors.entity_type" in str(db.statement)


def test_vector_repository_replaces_the_same_entity_chunk_without_duplicate_insert() -> None:
    """Re-indexing an unchanged section reuses its vector instead of adding a duplicate."""
    repository = VectorRepository()
    db = _ReplacementSession()
    payload = TextVectorCreate(
        entity_type="resume_section", entity_id=uuid4(), source_section_id=uuid4(), chunk_index=0, chunk_text="Python APIs"
    )

    first = repository.replace_entity_vectors(db, [payload], [[0.1, 0.2]])
    second = repository.replace_entity_vectors(db, [payload], [[0.3, 0.4]])

    assert len(db.vectors) == 1
    assert first[0] is second[0]
    assert second[0].embedding == [0.3, 0.4]
    assert db.deleted == []
