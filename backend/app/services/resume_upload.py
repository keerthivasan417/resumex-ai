"""Safe local storage and persistence for uploaded resumes."""

from pathlib import Path
import re
from io import BytesIO
from uuid import UUID, uuid4
from zipfile import BadZipFile, ZipFile

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.core import Resume, ResumeSection, ResumeStatus
from app.services.resume_extraction import DetectedSection, ExtractionError, detect_sections, extract_text


class UploadValidationError(ValueError):
    """Raised when an uploaded file fails safety validation."""


_ALLOWED_UPLOADS = {
    ".pdf": {"application/pdf"},
    ".docx": {"application/vnd.openxmlformats-officedocument.wordprocessingml.document"},
}


def sanitize_filename(filename: str) -> str:
    """Return a display-safe basename without allowing path components."""
    basename = filename.replace("\\", "/").rsplit("/", maxsplit=1)[-1]
    sanitized = re.sub(r"[^A-Za-z0-9._ -]", "_", basename).strip(" .")
    if not sanitized or sanitized in {".", ".."}:
        raise UploadValidationError("The uploaded filename is invalid.")
    return sanitized[:512]


def validate_upload(filename: str, content_type: str | None, file_bytes: bytes) -> tuple[str, str]:
    """Validate name, declared type, byte length, and file signature before storage."""
    sanitized_filename = sanitize_filename(filename)
    extension = Path(sanitized_filename).suffix.casefold()
    allowed_types = _ALLOWED_UPLOADS.get(extension)
    if allowed_types is None:
        raise UploadValidationError("Only PDF and DOCX resumes are accepted.")
    if not file_bytes:
        raise UploadValidationError("The uploaded file is empty.")
    if len(file_bytes) > settings.max_upload_size_bytes:
        raise UploadValidationError("The uploaded file exceeds the configured size limit.")
    if content_type and content_type.casefold() not in allowed_types:
        raise UploadValidationError("The uploaded file type does not match its extension.")
    if extension == ".pdf" and not file_bytes.startswith(b"%PDF-"):
        raise UploadValidationError("The uploaded PDF has an invalid file signature.")
    if extension == ".docx" and not _is_docx_archive(file_bytes):
        raise UploadValidationError("The uploaded DOCX has an invalid file signature.")
    return sanitized_filename, extension


def store_upload(file_bytes: bytes, extension: str) -> str:
    """Write a validated upload below the configured directory with a generated name."""
    upload_directory = settings.upload_directory
    upload_directory.mkdir(parents=True, exist_ok=True)
    stored_name = f"{uuid4().hex}{extension}"
    target_path = (upload_directory / stored_name).resolve()
    if target_path.parent != upload_directory:
        raise UploadValidationError("The upload path is invalid.")
    target_path.write_bytes(file_bytes)
    return stored_name


def remove_stored_upload(storage_key: str) -> None:
    """Remove a newly written file when its database transaction cannot complete."""
    target_path = (settings.upload_directory / storage_key).resolve()
    if target_path.parent == settings.upload_directory and target_path.is_file():
        target_path.unlink()


def persist_resume(
    db: Session,
    candidate_id: UUID,
    file_name: str,
    mime_type: str,
    storage_key: str,
    raw_text: str,
    sections: list[DetectedSection],
) -> Resume:
    """Create a resume and its deterministic sections in the current transaction."""
    resume = Resume(
        candidate_id=candidate_id,
        file_name=file_name,
        mime_type=mime_type,
        storage_key=storage_key,
        raw_text=raw_text,
        status=ResumeStatus.READY,
    )
    resume.sections = [
        ResumeSection(
            section_type=section.section_type,
            title=section.title,
            position=section.position,
            content=section.content,
        )
        for section in sections
    ]
    db.add(resume)
    db.flush()
    return resume


def process_upload(file_bytes: bytes, filename: str, content_type: str | None) -> tuple[str, str, str, list[DetectedSection]]:
    """Validate and extract an upload before it is stored or persisted."""
    sanitized_filename, extension = validate_upload(filename, content_type, file_bytes)
    raw_text = extract_text(file_bytes, extension)
    if not raw_text:
        raise ExtractionError("The resume does not contain extractable text.")
    return sanitized_filename, extension, raw_text, detect_sections(raw_text)


def _is_docx_archive(file_bytes: bytes) -> bool:
    try:
        with ZipFile(BytesIO(file_bytes)) as archive:
            return "[Content_Types].xml" in archive.namelist() and "word/document.xml" in archive.namelist()
    except BadZipFile:
        return False
