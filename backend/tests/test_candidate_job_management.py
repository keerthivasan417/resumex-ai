"""Offline API coverage for minimal candidate and job management."""

from uuid import uuid4

from fastapi.testclient import TestClient

from app.db.session import get_db
from app.main import app
from app.models.core import Candidate, Job, JobRequirement, JobStatus, RequirementImportance, Skill


class _ManagementSession:
    """Small deterministic database double for route-level contract tests."""

    def __init__(self) -> None:
        self.candidates: dict[object, Candidate] = {}
        self.jobs: list[Job] = []
        self.job_by_id: dict[object, Job] = {}
        self.added: list[object] = []

    def add(self, instance: object) -> None:
        self.added.append(instance)

    def flush(self) -> None:
        for instance in self.added:
            if getattr(instance, "id", None) is None:
                instance.id = uuid4()
            if isinstance(instance, Candidate):
                self.candidates[instance.id] = instance

    def commit(self) -> None:
        pass

    def refresh(self, instance: object) -> None:
        pass

    def get(self, model, identifier):
        if model is Candidate:
            return self.candidates.get(identifier)
        return None

    def scalars(self, statement):
        return self.jobs

    def scalar(self, statement):
        params = statement.compile().params
        requested_id = next((value for value in params.values() if value in self.job_by_id), None)
        return self.job_by_id.get(requested_id)


def _client_with(db: _ManagementSession) -> TestClient:
    app.dependency_overrides[get_db] = lambda: db
    return TestClient(app)


def test_candidate_create_then_get_uses_the_persisted_uuid() -> None:
    db = _ManagementSession()
    client = _client_with(db)
    try:
        created = client.post("/api/candidates", json={"full_name": "Ada Candidate"})
        candidate_id = created.json()["id"]
        fetched = client.get(f"/api/candidates/{candidate_id}")
    finally:
        app.dependency_overrides.clear()

    assert created.status_code == 201
    assert created.json()["full_name"] == "Ada Candidate"
    assert fetched.status_code == 200
    assert fetched.json()["id"] == candidate_id


def test_candidate_validation_and_missing_candidate_are_clear() -> None:
    db = _ManagementSession()
    client = _client_with(db)
    try:
        invalid = client.post("/api/candidates", json={"full_name": "   "})
        missing = client.get(f"/api/candidates/{uuid4()}")
    finally:
        app.dependency_overrides.clear()

    assert invalid.status_code == 400
    assert missing.status_code == 404


def test_job_list_and_detail_return_selector_data_and_missing_job_is_404() -> None:
    db = _ManagementSession()
    skill = Skill(id=uuid4(), name="Python", category="language")
    requirement = JobRequirement(
        id=uuid4(), description="Required Python", importance=RequirementImportance.REQUIRED, skill=skill
    )
    job = Job(
        id=uuid4(), title="Backend Engineer", company_name="ResumeX", description="Required Python",
        status=JobStatus.OPEN, requirements=[requirement],
    )
    db.jobs = [job]
    db.job_by_id[job.id] = job
    client = _client_with(db)
    try:
        listed = client.get("/api/jobs")
        detail = client.get(f"/api/jobs/{job.id}")
        missing = client.get(f"/api/jobs/{uuid4()}")
    finally:
        app.dependency_overrides.clear()

    assert listed.status_code == 200
    assert listed.json() == [{
        "id": str(job.id), "title": "Backend Engineer", "description": "Required Python", "company_name": "ResumeX", "location": None, "status": "open",
        "requirements": [{"id": str(requirement.id), "description": "Required Python", "importance": "required", "skill": "Python"}],
    }]
    assert detail.status_code == 200
    assert detail.json()["company_name"] == "ResumeX"
    assert detail.json()["location"] is None
    assert detail.json()["requirements"][0]["skill"] == "Python"
    assert missing.status_code == 404
