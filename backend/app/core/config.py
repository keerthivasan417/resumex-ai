"""Application settings loaded from environment variables."""

import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    """Runtime configuration for the API."""

    app_name: str
    app_env: str
    api_prefix: str
    database_url: str

    def __init__(self) -> None:
        self.app_name = os.getenv("APP_NAME", "ResumeX API")
        self.app_env = os.getenv("APP_ENV", "development")
        self.api_prefix = os.getenv("API_PREFIX", "/api")
        self.database_url = os.getenv(
            "DATABASE_URL",
            "postgresql+psycopg://resumex:resumex@localhost:5432/resumex",
        )


settings = Settings()
