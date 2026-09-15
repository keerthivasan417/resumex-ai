"""Add recruiter-owned state without changing automated screening evidence.

Revision ID: 0006_add_recruiter_screening_state
Revises: 0005_add_github_developer_intelligence
Create Date: 2026-09-15
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0006_add_recruiter_screening_state"
down_revision: Union[str, Sequence[str], None] = "0005_add_github_developer_intelligence"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    recruiter_stage = sa.Enum("new", "reviewing", "shortlisted", "on_hold", "rejected", name="recruiter_stage")
    recruiter_stage.create(op.get_bind(), checkfirst=True)
    op.add_column(
        "screening_results",
        sa.Column("recruiter_stage", recruiter_stage, nullable=False, server_default="new"),
    )
    op.add_column("screening_results", sa.Column("shortlisted", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column("screening_results", sa.Column("recruiter_updated_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column("screening_results", "recruiter_updated_at")
    op.drop_column("screening_results", "shortlisted")
    op.drop_column("screening_results", "recruiter_stage")
    sa.Enum(name="recruiter_stage").drop(op.get_bind(), checkfirst=True)
