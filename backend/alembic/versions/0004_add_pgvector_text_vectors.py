"""Enable pgvector and add generic text-vector storage.

Revision ID: 0004_add_pgvector_text_vectors
Revises: 0003_add_resume_skill_intelligence
Create Date: 2026-09-15
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects import postgresql

from app.core.config import settings


revision: str = "0004_add_pgvector_text_vectors"
down_revision: Union[str, Sequence[str], None] = "0003_add_resume_skill_intelligence"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _timestamps() -> list[sa.Column[object]]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    ]


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.create_table(
        "text_vectors",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("entity_type", sa.String(length=100), nullable=False),
        sa.Column("entity_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("source_section_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("resume_sections.id", ondelete="SET NULL")),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("chunk_text", sa.Text(), nullable=False),
        sa.Column("embedding", Vector(settings.embedding_dimensions), nullable=False),
        *_timestamps(),
        sa.UniqueConstraint("entity_type", "entity_id", "chunk_index", name="uq_text_vector_chunk"),
    )
    op.create_index("ix_text_vectors_entity_type", "text_vectors", ["entity_type"])
    op.create_index("ix_text_vectors_entity_id", "text_vectors", ["entity_id"])


def downgrade() -> None:
    op.drop_index("ix_text_vectors_entity_id", table_name="text_vectors")
    op.drop_index("ix_text_vectors_entity_type", table_name="text_vectors")
    op.drop_table("text_vectors")
