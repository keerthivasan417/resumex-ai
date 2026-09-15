"""Tests for the health-check endpoint."""

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check_returns_expected_response() -> None:
    """The health endpoint exposes the expected public contract."""
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "ResumeX API"}
    assert response.json()["status"] == "ok"
    assert response.json()["service"] == "ResumeX API"
