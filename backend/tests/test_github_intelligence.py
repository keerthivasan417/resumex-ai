"""Tests for public GitHub URL handling, API ingestion, and signal construction."""

from datetime import datetime, timezone
from uuid import uuid4

import httpx
import pytest

from app.api.routes.candidates import _response
from app.models.core import Candidate, DeveloperSignal, GitHubProfileSnapshot
from app.services.github_intelligence import (
    GitHubApiClient,
    GitHubIngestionService,
    GitHubProfileNotFound,
    GitHubPublicData,
    GitHubUrlError,
    normalize_github_profile_url,
)


def test_normalize_github_profile_url_accepts_only_one_public_profile() -> None:
    assert normalize_github_profile_url("https://www.github.com/Octo-Cat/") == (
        "https://github.com/Octo-Cat",
        "Octo-Cat",
    )
    with pytest.raises(GitHubUrlError):
        normalize_github_profile_url("https://github.com/octocat/repository")
    with pytest.raises(GitHubUrlError):
        normalize_github_profile_url("https://github.com.evil.example/octocat")


def test_github_client_collects_only_public_profile_and_repository_metadata() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/users/octocat":
            return httpx.Response(200, json={"login": "octocat", "name": "Octo Cat", "public_repos": 2})
        if request.url.path == "/users/octocat/repos":
            return httpx.Response(
                200,
                json=[
                    {"name": "api", "language": "Python", "stargazers_count": 4, "forks_count": 1},
                    {"name": "web", "language": "JavaScript", "stargazers_count": 2, "forks_count": 0},
                ],
            )
        return httpx.Response(404)

    public_data = GitHubApiClient(transport=httpx.MockTransport(handler)).fetch_public_data("octocat")

    assert public_data.profile["login"] == "octocat"
    assert [repository["name"] for repository in public_data.repositories] == ["api", "web"]


def test_github_client_maps_missing_profiles_to_a_graceful_error() -> None:
    client = GitHubApiClient(transport=httpx.MockTransport(lambda request: httpx.Response(404)))
    with pytest.raises(GitHubProfileNotFound):
        client.fetch_public_data("missing")


def test_github_signals_link_known_languages_to_normalized_skills() -> None:
    class FakeDb:
        def __init__(self) -> None:
            self.added = []

        def scalar(self, statement):
            return None

        def add(self, value) -> None:
            self.added.append(value)

    snapshot = GitHubProfileSnapshot(
        username="octocat",
        profile_url="https://github.com/octocat",
        public_repository_count=1,
        fetched_at=datetime.now(timezone.utc),
        payload={},
    )
    public_data = type("PublicData", (), {
        "profile": {"name": "Octo Cat", "public_repos": 1},
        "repositories": [{"name": "web", "language": "JS", "html_url": "https://github.com/octocat/web"}],
    })()

    signals = GitHubIngestionService()._build_signals(FakeDb(), snapshot, public_data, datetime.now(timezone.utc))

    language_signal = next(signal for signal in signals if signal.signal_type == "github_language")
    assert language_signal.label == "JavaScript"
    assert language_signal.details["repository_count"] == 1
    assert language_signal.skill is not None
    assert language_signal.skill.name == "JavaScript"


def test_enrichment_derives_activity_quality_breadth_and_strengths_from_cached_public_data() -> None:
    class FakeDb:
        def scalar(self, statement):
            return None

        def add(self, value) -> None:
            pass

    observed_at = datetime(2026, 9, 15, tzinfo=timezone.utc)
    snapshot = GitHubProfileSnapshot(
        username="octocat",
        profile_url="https://github.com/octocat",
        public_repository_count=2,
        fetched_at=observed_at,
        payload={},
    )
    public_data = GitHubPublicData(
        profile={"name": "Octo Cat", "public_repos": 2},
        repositories=[
            {
                "name": "api",
                "language": "Python",
                "html_url": "https://github.com/octocat/api",
                "description": "A public API",
                "stargazers_count": 3,
                "forks_count": 1,
                "updated_at": "2026-09-01T00:00:00Z",
                "archived": False,
            },
            {
                "name": "web",
                "language": "JavaScript",
                "html_url": "https://github.com/octocat/web",
                "updated_at": "2025-01-01T00:00:00Z",
                "archived": True,
            },
        ],
    )

    signals = GitHubIngestionService()._build_signals(FakeDb(), snapshot, public_data, observed_at)
    by_type = {signal.signal_type: [] for signal in signals}
    for signal in signals:
        by_type[signal.signal_type].append(signal)

    assert by_type["github_activity"][0].details["recent_repository_count"] == 1
    assert by_type["github_repository_quality"][0].source_url == "https://github.com/octocat/api"
    assert by_type["github_language_breadth"][0].details["language_count"] == 2
    assert {signal.label for signal in by_type["github_strength"]} == {"Python", "JavaScript"}
    assert all(signal.source_url for signal in signals)


def test_github_snapshot_cache_is_time_bounded() -> None:
    snapshot = GitHubProfileSnapshot(
        username="octocat",
        profile_url="https://github.com/octocat",
        public_repository_count=0,
        fetched_at=datetime.now(timezone.utc),
        payload={},
    )
    assert GitHubIngestionService(cache_ttl_seconds=60)._is_fresh(snapshot, datetime.now(timezone.utc))


def test_developer_intelligence_response_groups_cached_signals_without_resume_claims() -> None:
    observed_at = datetime.now(timezone.utc)
    candidate = Candidate(id=uuid4(), full_name="Octo Cat", github_profile_url="https://github.com/octocat")
    snapshot = GitHubProfileSnapshot(
        id=uuid4(),
        candidate=candidate,
        username="octocat",
        profile_url="https://github.com/octocat",
        public_repository_count=1,
        source="github_api",
        fetched_at=observed_at,
        payload={},
    )
    snapshot.signals = [
        DeveloperSignal(
            id=uuid4(), snapshot=snapshot, signal_type="github_activity", label="Public repository activity",
            source_url="https://github.com/octocat", observed_at=observed_at, details={"recent_repository_count": 1},
        ),
        DeveloperSignal(
            id=uuid4(), snapshot=snapshot, signal_type="github_repository", label="api",
            source_url="https://github.com/octocat/api", observed_at=observed_at, details={},
        ),
        DeveloperSignal(
            id=uuid4(), snapshot=snapshot, signal_type="github_repository_quality", label="api",
            source_url="https://github.com/octocat/api", observed_at=observed_at, details={"quality_score": 4},
        ),
        DeveloperSignal(
            id=uuid4(), snapshot=snapshot, signal_type="github_strength", label="Python",
            source_url="https://github.com/octocat", observed_at=observed_at,
            details={"evidence_scope": "github_public_data_only"},
        ),
    ]

    response = _response(candidate, snapshot)

    assert response.profile is not None and response.profile.username == "octocat"
    assert response.activity is not None and response.activity.signals[0].source_url == "https://github.com/octocat"
    assert response.repositories[0].quality is not None
    assert response.strengths[0].details["evidence_scope"] == "github_public_data_only"
