"""Application service for generating and storing local text embeddings."""

from sqlalchemy.orm import Session

from app.repositories.vector_repository import VectorRepository
from app.schemas.vector import TextVectorCreate
from app.services.embeddings import LocalEmbeddingService


class VectorStoreService:
    """Coordinate local embedding generation with pgvector persistence."""

    def __init__(
        self,
        embedding_service: LocalEmbeddingService | None = None,
        repository: VectorRepository | None = None,
    ) -> None:
        self.embedding_service = embedding_service or LocalEmbeddingService()
        self.repository = repository or VectorRepository()

    def store_text(self, db: Session, payload: TextVectorCreate):
        """Embed a supplied text chunk and persist it in the current transaction."""
        return self.repository.create(db, payload, self.embedding_service.embed(payload.chunk_text))
