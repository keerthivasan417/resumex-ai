"""Resume upload endpoints."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.config import settings
from app.models.core import Candidate
from app.schemas.resume import ResumeSectionResponse, ResumeUploadResponse
from app.services.resume_extraction import ExtractionError
from app.services.resume_upload import (
    UploadValidationError,
    persist_resume,
    process_upload,
    remove_stored_upload,
    store_upload,
)


router = APIRouter(tags=["resumes"])


@router.post("/resumes/upload", response_model=ResumeUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    candidate_id: Annotated[UUID, Form()],
    file: Annotated[UploadFile, File()],
    db: Annotated[Session, Depends(get_db)],
) -> ResumeUploadResponse:
    """Store and extract a PDF or DOCX resume for an existing candidate."""
    if db.get(Candidate, candidate_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found.")

    file_bytes = await file.read(settings.max_upload_size_bytes + 1)
    try:
        file_name, extension, raw_text, sections = process_upload(file_bytes, file.filename or "", file.content_type)
        storage_key = store_upload(file_bytes, extension)
        resume = persist_resume(db, candidate_id, file_name, file.content_type or "", storage_key, raw_text, sections)
        db.commit()
        db.refresh(resume)
    except UploadValidationError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
    except ExtractionError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(error)) from error
    except Exception:
        if "storage_key" in locals():
            remove_stored_upload(storage_key)
        db.rollback()
        raise

    return ResumeUploadResponse(
        id=resume.id,
        candidate_id=resume.candidate_id,
        file_name=resume.file_name,
        mime_type=resume.mime_type or "",
        status=resume.status.value,
        sections=[
            ResumeSectionResponse(
                section_type=section.section_type,
                title=section.title,
                position=section.position,
                content=section.content,
            )
            for section in resume.sections
        ],
    )
