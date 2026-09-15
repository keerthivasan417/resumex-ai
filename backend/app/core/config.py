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


settings = Settings()
