"""Idempotent indexing of job requirements and resume sections into pgvector."""

from sqlalchemy.orm import Session

from app.models.core import Job, Resume
from app.schemas.vector import TextVectorCreate
from app.services.vector_store import VectorStoreService


class SemanticIndexService:
    """Generate fresh vectors for current source text without accumulating duplicates."""

    def __init__(self, vector_store: VectorStoreService | None = None) -> None:
        self.vector_store = vector_store or VectorStoreService()

    def index_resume(self, db: Session, resume: Resume):
        """Replace vectors for every non-empty stored resume section and evidence snippet."""
        vectors = []
        for section in resume.sections:
            if not section.content.strip():
                continue
            payload = TextVectorCreate(
                entity_type="resume_section",
                entity_id=section.id,
                source_section_id=section.id,
                chunk_index=0,
                chunk_text=section.content,
            )
            vectors.extend(self.vector_store.replace_entity_texts(db, [payload]))
        for resume_skill in getattr(resume, "skill_intelligence", []):
            for evidence in resume_skill.evidence:
                if not evidence.excerpt.strip():
                    continue
                payload = TextVectorCreate(
                    entity_type="skill_evidence",
                    entity_id=evidence.id,
                    source_section_id=evidence.resume_section_id,
                    chunk_index=0,
                    chunk_text=evidence.excerpt,
                )
                vectors.extend(self.vector_store.replace_entity_texts(db, [payload]))
        return vectors

    def index_job(self, db: Session, job: Job):
        """Replace vectors for every stored job requirement."""
        vectors = []
        for requirement in job.requirements:
            if not requirement.description.strip():
                continue
            payload = TextVectorCreate(
                entity_type="job_requirement",
                entity_id=requirement.id,
                chunk_index=0,
                chunk_text=requirement.description,
            )
            vectors.extend(self.vector_store.replace_entity_texts(db, [payload]))
        return vectors
