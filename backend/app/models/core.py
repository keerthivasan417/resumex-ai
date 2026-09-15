"""Normalized core persistence models for ResumeX."""

import uuid
from datetime import date, datetime
from enum import Enum

from sqlalchemy import JSON, Boolean, Date, DateTime, Enum as SqlEnum, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector

from app.core.config import settings
from app.db.base import Base, TimestampMixin


class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class ResumeStatus(str, Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


class JobStatus(str, Enum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"


class RequirementImportance(str, Enum):
    REQUIRED = "required"
    PREFERRED = "preferred"


class ScreeningStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"


class RecruiterStage(str, Enum):
    NEW = "new"
    REVIEWING = "reviewing"
    SHORTLISTED = "shortlisted"
    ON_HOLD = "on_hold"
    REJECTED = "rejected"


class SkillEvidenceStatus(str, Enum):
    STRONG_EVIDENCE = "strong_evidence"
    SUPPORTED = "supported"
    WEAK_EVIDENCE = "weak_evidence"
    NEEDS_VERIFICATION = "needs_verification"
    NOT_FOUND = "not_found"


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[UserStatus] = mapped_column(SqlEnum(UserStatus, name="user_status"), default=UserStatus.ACTIVE, nullable=False)

    candidates: Mapped[list["Candidate"]] = relationship(back_populates="owner")
    jobs: Mapped[list["Job"]] = relationship(back_populates="owner")


class Candidate(TimestampMixin, Base):
    __tablename__ = "candidates"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(320), index=True)
    headline: Mapped[str | None] = mapped_column(String(500))
    location: Mapped[str | None] = mapped_column(String(255))
    github_profile_url: Mapped[str | None] = mapped_column(String(2048))

    owner: Mapped["User | None"] = relationship(back_populates="candidates")
    resumes: Mapped[list["Resume"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    skills: Mapped[list["CandidateSkill"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    projects: Mapped[list["Project"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    experiences: Mapped[list["Experience"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    screening_results: Mapped[list["ScreeningResult"]] = relationship(back_populates="candidate")
    github_snapshot: Mapped["GitHubProfileSnapshot | None"] = relationship(
        back_populates="candidate", cascade="all, delete-orphan", uselist=False
    )


class Resume(TimestampMixin, Base):
    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name: Mapped[str] = mapped_column(String(512), nullable=False)
    storage_key: Mapped[str | None] = mapped_column(String(1024))
    mime_type: Mapped[str | None] = mapped_column(String(255))
    raw_text: Mapped[str | None] = mapped_column(Text)
    status: Mapped[ResumeStatus] = mapped_column(SqlEnum(ResumeStatus, name="resume_status"), default=ResumeStatus.UPLOADED, nullable=False)

    candidate: Mapped["Candidate"] = relationship(back_populates="resumes")
    sections: Mapped[list["ResumeSection"]] = relationship(back_populates="resume", cascade="all, delete-orphan")
    skill_intelligence: Mapped[list["ResumeSkill"]] = relationship(back_populates="resume", cascade="all, delete-orphan")
    screening_results: Mapped[list["ScreeningResult"]] = relationship(back_populates="resume")


class ResumeSection(TimestampMixin, Base):
    __tablename__ = "resume_sections"
    __table_args__ = (UniqueConstraint("resume_id", "section_type", "position", name="uq_resume_section_position"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    section_type: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str | None] = mapped_column(String(255))
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    resume: Mapped["Resume"] = relationship(back_populates="sections")
    evidence: Mapped[list["Evidence"]] = relationship(back_populates="resume_section")
    skill_evidence: Mapped[list["SkillEvidence"]] = relationship(back_populates="resume_section")
    vectors: Mapped[list["TextVector"]] = relationship(back_populates="resume_section")


class TextVector(TimestampMixin, Base):
    """A reusable embedding for a chunk of resume or job text."""

    __tablename__ = "text_vectors"
    __table_args__ = (UniqueConstraint("entity_type", "entity_id", "chunk_index", name="uq_text_vector_chunk"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    source_section_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("resume_sections.id", ondelete="SET NULL"), nullable=True)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[list[float]] = mapped_column(Vector(settings.embedding_dimensions), nullable=False)

    resume_section: Mapped["ResumeSection | None"] = relationship(back_populates="vectors")


class Skill(TimestampMixin, Base):
    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    category: Mapped[str | None] = mapped_column(String(100))

    candidates: Mapped[list["CandidateSkill"]] = relationship(back_populates="skill")
    job_requirements: Mapped[list["JobRequirement"]] = relationship(back_populates="skill")
    resume_skills: Mapped[list["ResumeSkill"]] = relationship(back_populates="skill")
    developer_signals: Mapped[list["DeveloperSignal"]] = relationship(back_populates="skill")


class GitHubProfileSnapshot(TimestampMixin, Base):
    """Cached public GitHub profile data for one candidate."""

    __tablename__ = "github_profile_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, unique=True, index=True
    )
    username: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    profile_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    profile_name: Mapped[str | None] = mapped_column(String(255))
    public_repository_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    source: Mapped[str] = mapped_column(String(100), nullable=False, default="github_api")
    fetched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    payload: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False, default=dict)

    candidate: Mapped["Candidate"] = relationship(back_populates="github_snapshot")
    signals: Mapped[list["DeveloperSignal"]] = relationship(
        back_populates="snapshot", cascade="all, delete-orphan"
    )


class DeveloperSignal(TimestampMixin, Base):
    """Explainable public developer evidence sourced from a GitHub snapshot."""

    __tablename__ = "developer_signals"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    snapshot_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("github_profile_snapshots.id", ondelete="CASCADE"), nullable=False, index=True
    )
    skill_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("skills.id", ondelete="SET NULL"), nullable=True)
    signal_type: Mapped[str] = mapped_column(String(100), nullable=False)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    source_url: Mapped[str | None] = mapped_column(String(2048))
    observed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    details: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False, default=dict)

    snapshot: Mapped["GitHubProfileSnapshot"] = relationship(back_populates="signals")
    skill: Mapped["Skill | None"] = relationship(back_populates="developer_signals")


class ResumeSkill(TimestampMixin, Base):
    __tablename__ = "resume_skills"
    __table_args__ = (UniqueConstraint("resume_id", "skill_id", name="uq_resume_skill"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    status: Mapped[SkillEvidenceStatus] = mapped_column(SqlEnum(SkillEvidenceStatus, name="skill_evidence_status"), nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)

    resume: Mapped["Resume"] = relationship(back_populates="skill_intelligence")
    skill: Mapped["Skill"] = relationship(back_populates="resume_skills")
    evidence: Mapped[list["SkillEvidence"]] = relationship(back_populates="resume_skill", cascade="all, delete-orphan")


class SkillEvidence(TimestampMixin, Base):
    __tablename__ = "skill_evidence"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("resume_skills.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_section_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("resume_sections.id", ondelete="SET NULL"), nullable=True)
    section_type: Mapped[str] = mapped_column(String(100), nullable=False)
    line_number: Mapped[int] = mapped_column(Integer, nullable=False)
    excerpt: Mapped[str] = mapped_column(Text, nullable=False)
    weight: Mapped[int] = mapped_column(Integer, nullable=False)
    reason: Mapped[str] = mapped_column(String(500), nullable=False)

    resume_skill: Mapped["ResumeSkill"] = relationship(back_populates="evidence")
    resume_section: Mapped["ResumeSection | None"] = relationship(back_populates="skill_evidence")


class CandidateSkill(TimestampMixin, Base):
    __tablename__ = "candidate_skills"

    candidate_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("candidates.id", ondelete="CASCADE"), primary_key=True)
    skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
    years_experience: Mapped[float | None] = mapped_column(Numeric(4, 1))

    candidate: Mapped["Candidate"] = relationship(back_populates="skills")
    skill: Mapped["Skill"] = relationship(back_populates="candidates")


class Job(TimestampMixin, Base):
    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[JobStatus] = mapped_column(SqlEnum(JobStatus, name="job_status"), default=JobStatus.DRAFT, nullable=False)

    owner: Mapped["User | None"] = relationship(back_populates="jobs")
    requirements: Mapped[list["JobRequirement"]] = relationship(back_populates="job", cascade="all, delete-orphan")
    screening_results: Mapped[list["ScreeningResult"]] = relationship(back_populates="job", cascade="all, delete-orphan")


class JobRequirement(TimestampMixin, Base):
    __tablename__ = "job_requirements"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("skills.id", ondelete="SET NULL"), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    importance: Mapped[RequirementImportance] = mapped_column(SqlEnum(RequirementImportance, name="requirement_importance"), default=RequirementImportance.REQUIRED, nullable=False)
    minimum_years: Mapped[float | None] = mapped_column(Numeric(4, 1))

    job: Mapped["Job"] = relationship(back_populates="requirements")
    skill: Mapped["Skill | None"] = relationship(back_populates="job_requirements")
    evidence: Mapped[list["Evidence"]] = relationship(back_populates="job_requirement")


class ScreeningResult(TimestampMixin, Base):
    __tablename__ = "screening_results"
    __table_args__ = (UniqueConstraint("candidate_id", "job_id", "resume_id", name="uq_screening_result_scope"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[ScreeningStatus] = mapped_column(SqlEnum(ScreeningStatus, name="screening_status"), default=ScreeningStatus.PENDING, nullable=False)
    score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    summary: Mapped[str | None] = mapped_column(Text)
    recruiter_stage: Mapped[RecruiterStage] = mapped_column(
        SqlEnum(RecruiterStage, name="recruiter_stage"), default=RecruiterStage.NEW, nullable=False
    )
    shortlisted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    recruiter_updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    candidate: Mapped["Candidate"] = relationship(back_populates="screening_results")
    job: Mapped["Job"] = relationship(back_populates="screening_results")
    resume: Mapped["Resume | None"] = relationship(back_populates="screening_results")
    evidence: Mapped[list["Evidence"]] = relationship(back_populates="screening_result", cascade="all, delete-orphan")


class Evidence(TimestampMixin, Base):
    __tablename__ = "evidence"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    screening_result_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("screening_results.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_section_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("resume_sections.id", ondelete="SET NULL"), nullable=True)
    job_requirement_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("job_requirements.id", ondelete="SET NULL"), nullable=True)
    evidence_type: Mapped[str] = mapped_column(String(100), nullable=False)
    excerpt: Mapped[str] = mapped_column(Text, nullable=False)
    source_reference: Mapped[str | None] = mapped_column(String(512))

    screening_result: Mapped["ScreeningResult"] = relationship(back_populates="evidence")
    resume_section: Mapped["ResumeSection | None"] = relationship(back_populates="evidence")
    job_requirement: Mapped["JobRequirement | None"] = relationship(back_populates="evidence")


class Project(TimestampMixin, Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    url: Mapped[str | None] = mapped_column(String(2048))
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    candidate: Mapped["Candidate"] = relationship(back_populates="projects")


class Experience(TimestampMixin, Base):
    __tablename__ = "experiences"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    description: Mapped[str | None] = mapped_column(Text)
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    candidate: Mapped["Candidate"] = relationship(back_populates="experiences")
