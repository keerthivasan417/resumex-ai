"""Metadata-only tests for the PostgreSQL persistence foundation."""

from app.core.config import settings
from app.db.session import SessionLocal, engine, get_db
from app.models import Base


def test_database_configuration_uses_postgresql_psycopg() -> None:
    """The configured engine targets PostgreSQL through psycopg."""
    assert settings.database_url.startswith("postgresql+psycopg://")
    assert engine.url.drivername == "postgresql+psycopg"


def test_core_model_metadata_contains_expected_tables() -> None:
    """All initial domain models are registered in SQLAlchemy metadata."""
    expected_tables = {
        "users",
        "candidates",
        "resumes",
        "resume_sections",
        "skills",
        "jobs",
        "job_requirements",
        "screening_results",
        "evidence",
        "resume_skills",
        "skill_evidence",
        "text_vectors",
        "projects",
        "experiences",
    }

    assert expected_tables.issubset(Base.metadata.tables)
    assert "candidate_skills" in Base.metadata.tables
    assert Base.metadata.tables["resumes"].c.candidate_id.foreign_keys
    assert Base.metadata.tables["screening_results"].c.job_id.foreign_keys


def test_session_dependency_creates_a_session_without_connecting() -> None:
    """The dependency is usable without requiring a hosted PostgreSQL instance."""
    dependency = get_db()
    session = next(dependency)

    assert isinstance(session, SessionLocal.class_)
    assert session.bind is engine

    dependency.close()
