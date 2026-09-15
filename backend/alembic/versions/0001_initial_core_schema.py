"""Create the initial normalized ResumeX core schema.

Revision ID: 0001_initial_core_schema
Revises:
Create Date: 2026-09-15
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "0001_initial_core_schema"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _timestamps() -> list[sa.Column[object]]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    ]


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("display_name", sa.String(length=255), nullable=False),
        sa.Column("status", sa.Enum("active", "inactive", name="user_status"), nullable=False),
        *_timestamps(),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "skills",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=100)),
        *_timestamps(),
        sa.UniqueConstraint("name"),
    )

    op.create_table(
        "candidates",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=320)),
        sa.Column("headline", sa.String(length=500)),
        sa.Column("location", sa.String(length=255)),
        *_timestamps(),
    )
    op.create_index("ix_candidates_email", "candidates", ["email"])

    op.create_table(
        "jobs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=False),
        sa.Column("location", sa.String(length=255)),
        sa.Column("description", sa.Text()),
        sa.Column("status", sa.Enum("draft", "open", "closed", name="job_status"), nullable=False),
        *_timestamps(),
    )

    op.create_table(
        "resumes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("candidate_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False),
        sa.Column("file_name", sa.String(length=512), nullable=False),
        sa.Column("storage_key", sa.String(length=1024)),
        sa.Column("mime_type", sa.String(length=255)),
        sa.Column("status", sa.Enum("uploaded", "processing", "ready", "failed", name="resume_status"), nullable=False),
        *_timestamps(),
    )
    op.create_index("ix_resumes_candidate_id", "resumes", ["candidate_id"])

    op.create_table(
        "candidate_skills",
        sa.Column("candidate_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("candidates.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("skill_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("years_experience", sa.Numeric(precision=4, scale=1)),
        *_timestamps(),
    )

    op.create_table(
        "projects",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("candidate_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("url", sa.String(length=2048)),
        sa.Column("position", sa.Integer(), nullable=False),
        *_timestamps(),
    )
    op.create_index("ix_projects_candidate_id", "projects", ["candidate_id"])

    op.create_table(
        "experiences",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("candidate_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("start_date", sa.Date()),
        sa.Column("end_date", sa.Date()),
        sa.Column("description", sa.Text()),
        sa.Column("position", sa.Integer(), nullable=False),
        *_timestamps(),
    )
    op.create_index("ix_experiences_candidate_id", "experiences", ["candidate_id"])

    op.create_table(
        "resume_sections",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("resume_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("section_type", sa.String(length=100), nullable=False),
        sa.Column("title", sa.String(length=255)),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        *_timestamps(),
        sa.UniqueConstraint("resume_id", "section_type", "position", name="uq_resume_section_position"),
    )
    op.create_index("ix_resume_sections_resume_id", "resume_sections", ["resume_id"])

    op.create_table(
        "job_requirements",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("job_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("skill_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("skills.id", ondelete="SET NULL")),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("importance", sa.Enum("required", "preferred", name="requirement_importance"), nullable=False),
        sa.Column("minimum_years", sa.Numeric(precision=4, scale=1)),
        *_timestamps(),
    )
    op.create_index("ix_job_requirements_job_id", "job_requirements", ["job_id"])

    op.create_table(
        "screening_results",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("candidate_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False),
        sa.Column("job_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("resume_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("resumes.id", ondelete="SET NULL")),
        sa.Column("status", sa.Enum("pending", "completed", "failed", name="screening_status"), nullable=False),
        sa.Column("score", sa.Numeric(precision=5, scale=2)),
        sa.Column("summary", sa.Text()),
        *_timestamps(),
        sa.UniqueConstraint("candidate_id", "job_id", "resume_id", name="uq_screening_result_scope"),
    )
    op.create_index("ix_screening_results_candidate_id", "screening_results", ["candidate_id"])
    op.create_index("ix_screening_results_job_id", "screening_results", ["job_id"])

    op.create_table(
        "evidence",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("screening_result_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("screening_results.id", ondelete="CASCADE"), nullable=False),
        sa.Column("resume_section_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("resume_sections.id", ondelete="SET NULL")),
        sa.Column("job_requirement_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("job_requirements.id", ondelete="SET NULL")),
        sa.Column("evidence_type", sa.String(length=100), nullable=False),
        sa.Column("excerpt", sa.Text(), nullable=False),
        sa.Column("source_reference", sa.String(length=512)),
        *_timestamps(),
    )
    op.create_index("ix_evidence_screening_result_id", "evidence", ["screening_result_id"])


def downgrade() -> None:
    op.drop_index("ix_evidence_screening_result_id", table_name="evidence")
    op.drop_table("evidence")
    op.drop_index("ix_screening_results_job_id", table_name="screening_results")
    op.drop_index("ix_screening_results_candidate_id", table_name="screening_results")
    op.drop_table("screening_results")
    op.drop_index("ix_job_requirements_job_id", table_name="job_requirements")
    op.drop_table("job_requirements")
    op.drop_index("ix_resume_sections_resume_id", table_name="resume_sections")
    op.drop_table("resume_sections")
    op.drop_index("ix_experiences_candidate_id", table_name="experiences")
    op.drop_table("experiences")
    op.drop_index("ix_projects_candidate_id", table_name="projects")
    op.drop_table("projects")
    op.drop_table("candidate_skills")
    op.drop_index("ix_resumes_candidate_id", table_name="resumes")
    op.drop_table("resumes")
    op.drop_table("jobs")
    op.drop_index("ix_candidates_email", table_name="candidates")
    op.drop_table("candidates")
    op.drop_table("skills")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")

    bind = op.get_bind()
    for enum_name in (
        "screening_status",
        "requirement_importance",
        "resume_status",
        "job_status",
        "user_status",
    ):
        sa.Enum(name=enum_name).drop(bind, checkfirst=True)
