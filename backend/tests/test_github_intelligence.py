"""Tests for public GitHub URL handling, API ingestion, and signal construction."""

from datetime import datetime, timezone

import httpx
import pytest

from app.models.core import GitHubProfileSnapshot
from app.services.github_intelligence import (
    GitHubApiClient,
    GitHubIngestionService,
    GitHubProfileNotFound,
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


def test_github_snapshot_cache_is_time_bounded() -> None:
    snapshot = GitHubProfileSnapshot(
        username="octocat",
        profile_url="https://github.com/octocat",
        public_repository_count=0,
        fetched_at=datetime.now(timezone.utc),
        payload={},
    )
    assert GitHubIngestionService(cache_ttl_seconds=60)._is_fresh(snapshot, datetime.now(timezone.utc))
