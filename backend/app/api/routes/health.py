"""Health-check endpoint."""

from fastapi import APIRouter

from app.schemas.health import HealthResponse


router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    """Return the API availability status."""
    return HealthResponse(status="ok", service="ResumeX API")
