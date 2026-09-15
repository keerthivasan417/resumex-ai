"""Application settings loaded from environment variables."""

import os
from pathlib import Path

from dotenv import load_dotenv


load_dotenv()


class Settings:
    """Runtime configuration for the API."""

    app_name: str
    app_env: str
    api_prefix: str
    database_url: str
    upload_directory: Path
    max_upload_size_bytes: int
    match_required_weight: float
    match_preferred_weight: float
    embedding_model: str
    embedding_dimensions: int
    semantic_similarity_threshold: float
    match_evidence_weight: float
    match_semantic_weight: float

    def __init__(self) -> None:
        self.app_name = os.getenv("APP_NAME", "ResumeX API")
        self.app_env = os.getenv("APP_ENV", "development")
        self.api_prefix = os.getenv("API_PREFIX", "/api")
        self.database_url = os.getenv(
            "DATABASE_URL",
            "postgresql+psycopg://resumex:resumex@localhost:5432/resumex",
        )
        configured_upload_directory = Path(os.getenv("UPLOAD_DIRECTORY", "uploads"))
        if not configured_upload_directory.is_absolute():
            configured_upload_directory = Path(__file__).resolve().parents[2] / configured_upload_directory
        self.upload_directory = configured_upload_directory.resolve()
        self.max_upload_size_bytes = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", "10485760"))
        self.match_required_weight = float(os.getenv("MATCH_REQUIRED_WEIGHT", "3"))
        self.match_preferred_weight = float(os.getenv("MATCH_PREFERRED_WEIGHT", "1"))
        self.embedding_model = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        self.embedding_dimensions = int(os.getenv("EMBEDDING_DIMENSIONS", "384"))
        if self.embedding_dimensions < 1:
            raise ValueError("EMBEDDING_DIMENSIONS must be a positive integer.")
        self.semantic_similarity_threshold = float(os.getenv("SEMANTIC_SIMILARITY_THRESHOLD", "0.65"))
        self.match_evidence_weight = float(os.getenv("MATCH_EVIDENCE_WEIGHT", "0.7"))
        self.match_semantic_weight = float(os.getenv("MATCH_SEMANTIC_WEIGHT", "0.3"))
        if not 0 <= self.semantic_similarity_threshold <= 1:
            raise ValueError("SEMANTIC_SIMILARITY_THRESHOLD must be between 0 and 1.")
        if self.match_evidence_weight < 0 or self.match_semantic_weight < 0:
            raise ValueError("Match weights cannot be negative.")
        if self.match_evidence_weight + self.match_semantic_weight == 0:
            raise ValueError("At least one match weight must be positive.")


settings = Settings()
