"""PostgreSQL pgvector persistence and cosine-similarity search."""

from uuid import UUID

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.models.core import TextVector
from app.schemas.vector import TextVectorCreate


class VectorRepository:
    """Store generated vectors and retrieve nearest chunks by cosine distance."""

    def create(self, db: Session, payload: TextVectorCreate, embedding: list[float]) -> TextVector:
        """Persist a text chunk with an already validated embedding."""
        vector = TextVector(**payload.model_dump(), embedding=embedding)
        db.add(vector)
        db.flush()
        return vector

    def search_cosine(
        self,
        db: Session,
        query_embedding: list[float],
        *,
        entity_type: str | None = None,
        limit: int = 10,
    ) -> list[tuple[TextVector, float]]:
        """Return nearest stored chunks ordered by pgvector cosine distance."""
        if limit < 1:
            raise ValueError("limit must be at least 1")
        distance = TextVector.embedding.cosine_distance(query_embedding).label("cosine_distance")
        statement: Select[tuple[TextVector, float]] = select(TextVector, distance).order_by(distance).limit(limit)
        if entity_type:
            statement = statement.where(TextVector.entity_type == entity_type)
        return [(vector, float(cosine_distance)) for vector, cosine_distance in db.execute(statement).all()]
