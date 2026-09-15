"""Add normalized resume skill intelligence and evidence rows.

Revision ID: 0003_add_resume_skill_intelligence
Revises: 0002_add_resume_raw_text
Create Date: 2026-09-15
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "0003_add_resume_skill_intelligence"
down_revision: Union[str, Sequence[str], None] = "0002_add_resume_raw_text"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _timestamps() -> list[sa.Column[object]]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    ]


def upgrade() -> None:
    op.alter_column(
        "alembic_version",
        "version_num",
        existing_type=sa.String(length=32),
        type_=sa.String(length=128),
        existing_nullable=False,
    )
    op.create_table(
        "resume_skills",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("resume_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("skill_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("skills.id", ondelete="CASCADE"), nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "strong_evidence",
                "supported",
                "weak_evidence",
                "needs_verification",
                "not_found",
                name="skill_evidence_status",
            ),
            nullable=False,
        ),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False),
        *_timestamps(),
        sa.UniqueConstraint("resume_id", "skill_id", name="uq_resume_skill"),
    )
    op.create_index("ix_resume_skills_resume_id", "resume_skills", ["resume_id"])
    op.create_index("ix_resume_skills_skill_id", "resume_skills", ["skill_id"])

    op.create_table(
        "skill_evidence",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("resume_skill_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("resume_skills.id", ondelete="CASCADE"), nullable=False),
        sa.Column("resume_section_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("resume_sections.id", ondelete="SET NULL")),
        sa.Column("section_type", sa.String(length=100), nullable=False),
        sa.Column("line_number", sa.Integer(), nullable=False),
        sa.Column("excerpt", sa.Text(), nullable=False),
        sa.Column("weight", sa.Integer(), nullable=False),
        sa.Column("reason", sa.String(length=500), nullable=False),
        *_timestamps(),
    )
    op.create_index("ix_skill_evidence_resume_skill_id", "skill_evidence", ["resume_skill_id"])


def downgrade() -> None:
    op.drop_index("ix_skill_evidence_resume_skill_id", table_name="skill_evidence")
    op.drop_table("skill_evidence")
    op.drop_index("ix_resume_skills_skill_id", table_name="resume_skills")
    op.drop_index("ix_resume_skills_resume_id", table_name="resume_skills")
    op.drop_table("resume_skills")
    sa.Enum(name="skill_evidence_status").drop(op.get_bind(), checkfirst=True)
    op.alter_column(
        "alembic_version",
        "version_num",
        existing_type=sa.String(length=128),
        type_=sa.String(length=32),
        existing_nullable=False,
    )
