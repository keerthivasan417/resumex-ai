"""Add cached public GitHub developer-intelligence storage.

Revision ID: 0005_add_github_developer_intelligence
Revises: 0004_add_pgvector_text_vectors
Create Date: 2026-09-15
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "0005_add_github_developer_intelligence"
down_revision: Union[str, Sequence[str], None] = "0004_add_pgvector_text_vectors"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _timestamps() -> list[sa.Column[object]]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    ]


def upgrade() -> None:
    op.add_column("candidates", sa.Column("github_profile_url", sa.String(length=2048), nullable=True))
    op.create_table(
        "github_profile_snapshots",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("candidate_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False),
        sa.Column("username", sa.String(length=255), nullable=False),
        sa.Column("profile_url", sa.String(length=2048), nullable=False),
        sa.Column("profile_name", sa.String(length=255), nullable=True),
        sa.Column("public_repository_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("source", sa.String(length=100), nullable=False, server_default="github_api"),
        sa.Column("fetched_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False),
        *_timestamps(),
        sa.UniqueConstraint("candidate_id", name="uq_github_profile_snapshot_candidate"),
    )
    op.create_index("ix_github_profile_snapshots_candidate_id", "github_profile_snapshots", ["candidate_id"])
    op.create_index("ix_github_profile_snapshots_username", "github_profile_snapshots", ["username"])
    op.create_table(
        "developer_signals",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("snapshot_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("github_profile_snapshots.id", ondelete="CASCADE"), nullable=False),
        sa.Column("skill_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("skills.id", ondelete="SET NULL"), nullable=True),
        sa.Column("signal_type", sa.String(length=100), nullable=False),
        sa.Column("label", sa.String(length=255), nullable=False),
        sa.Column("source_url", sa.String(length=2048), nullable=True),
        sa.Column("observed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("details", sa.JSON(), nullable=False),
        *_timestamps(),
    )
    op.create_index("ix_developer_signals_snapshot_id", "developer_signals", ["snapshot_id"])


def downgrade() -> None:
    op.drop_index("ix_developer_signals_snapshot_id", table_name="developer_signals")
    op.drop_table("developer_signals")
    op.drop_index("ix_github_profile_snapshots_username", table_name="github_profile_snapshots")
    op.drop_index("ix_github_profile_snapshots_candidate_id", table_name="github_profile_snapshots")
    op.drop_table("github_profile_snapshots")
    op.drop_column("candidates", "github_profile_url")
