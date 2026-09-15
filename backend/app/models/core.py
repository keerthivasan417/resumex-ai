"""Normalized core persistence models for ResumeX."""

import uuid
from datetime import date
from enum import Enum

from sqlalchemy import Boolean, Date, Enum as SqlEnum, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

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

    owner: Mapped["User | None"] = relationship(back_populates="candidates")
    resumes: Mapped[list["Resume"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    skills: Mapped[list["CandidateSkill"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    projects: Mapped[list["Project"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    experiences: Mapped[list["Experience"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    screening_results: Mapped[list["ScreeningResult"]] = relationship(back_populates="candidate")


class Resume(TimestampMixin, Base):
    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name: Mapped[str] = mapped_column(String(512), nullable=False)
    storage_key: Mapped[str | None] = mapped_column(String(1024))
    mime_type: Mapped[str | None] = mapped_column(String(255))
    status: Mapped[ResumeStatus] = mapped_column(SqlEnum(ResumeStatus, name="resume_status"), default=ResumeStatus.UPLOADED, nullable=False)

    candidate: Mapped["Candidate"] = relationship(back_populates="resumes")
    sections: Mapped[list["ResumeSection"]] = relationship(back_populates="resume", cascade="all, delete-orphan")
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


class Skill(TimestampMixin, Base):
    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    category: Mapped[str | None] = mapped_column(String(100))

    candidates: Mapped[list["CandidateSkill"]] = relationship(back_populates="skill")
    job_requirements: Mapped[list["JobRequirement"]] = relationship(back_populates="skill")


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
