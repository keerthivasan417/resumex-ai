"""FastAPI application entry point."""

# pyrefly: ignore [missing-import]
from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.resumes import router as resumes_router
from app.api.routes.skill_intelligence import router as skill_intelligence_router
from app.core.config import settings


app = FastAPI(title=settings.app_name)
app.include_router(health_router, prefix=settings.api_prefix)
app.include_router(resumes_router, prefix=settings.api_prefix)
app.include_router(skill_intelligence_router, prefix=settings.api_prefix)
