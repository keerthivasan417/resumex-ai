"""PostgreSQL pgvector persistence and cosine-similarity search."""

from uuid import UUID

from sqlalchemy import Select, delete, select
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
        entity_ids: list[UUID] | None = None,
        limit: int = 10,
    ) -> list[tuple[TextVector, float]]:
        """Return nearest stored chunks ordered by pgvector cosine distance."""
        if limit < 1:
            raise ValueError("limit must be at least 1")
        distance = TextVector.embedding.cosine_distance(query_embedding).label("cosine_distance")
        statement: Select[tuple[TextVector, float]] = select(TextVector, distance).order_by(distance).limit(limit)
        if entity_type:
            statement = statement.where(TextVector.entity_type == entity_type)
        if entity_ids is not None:
            if not entity_ids:
                return []
            statement = statement.where(TextVector.entity_id.in_(entity_ids))
        return [(vector, float(cosine_distance)) for vector, cosine_distance in db.execute(statement).all()]

    def replace_entity_vectors(
        self, db: Session, payloads: list[TextVectorCreate], embeddings: list[list[float]]
    ) -> list[TextVector]:
        """Replace all vectors for one entity, avoiding duplicate chunks on re-indexing."""
        if len(payloads) != len(embeddings):
            raise ValueError("payloads and embeddings must have the same length")
        if not payloads:
            return []
        entity_type = payloads[0].entity_type
        entity_id = payloads[0].entity_id
        if any(item.entity_type != entity_type or item.entity_id != entity_id for item in payloads):
            raise ValueError("All replacement chunks must belong to the same entity")
        db.execute(delete(TextVector).where(TextVector.entity_type == entity_type, TextVector.entity_id == entity_id))
        return [self.create(db, payload, embedding) for payload, embedding in zip(payloads, embeddings, strict=True)]
