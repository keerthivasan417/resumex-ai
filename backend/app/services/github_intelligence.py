"""Public GitHub ingestion and cached developer-intelligence signals."""

from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import re
from typing import Any
from urllib.parse import urlparse

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.core import Candidate, DeveloperSignal, GitHubProfileSnapshot, Skill
from app.services.skill_catalog import normalize_skill


_GITHUB_USERNAME = re.compile(r"^[A-Za-z\d](?:[A-Za-z\d-]{0,37}[A-Za-z\d])?$")


class GitHubUrlError(ValueError):
    """Raised when a supplied URL is not a public GitHub profile URL."""


class GitHubApiError(RuntimeError):
    """Raised for an unavailable or invalid GitHub public API response."""


class GitHubProfileNotFound(GitHubApiError):
    """Raised when GitHub has no public profile for the supplied username."""


class GitHubRateLimited(GitHubApiError):
    """Raised when GitHub declines a public API request because of rate limits."""


class CandidateNotFound(LookupError):
    """Raised when a candidate cannot be loaded for developer enrichment."""


@dataclass(frozen=True)
class GitHubPublicData:
    """Only the public profile and repository fields ResumeX retains."""

    profile: dict[str, Any]
    repositories: list[dict[str, Any]]


def normalize_github_profile_url(value: str) -> tuple[str, str]:
    """Validate one GitHub profile URL and return its canonical URL and username."""
    parsed = urlparse(value.strip())
    try:
        port = parsed.port
    except ValueError as error:
        raise GitHubUrlError("Provide a valid public GitHub profile URL.") from error
    if (
        parsed.scheme.lower() not in {"http", "https"}
        or parsed.hostname not in {"github.com", "www.github.com"}
        or parsed.username is not None
        or parsed.password is not None
        or port is not None
    ):
        raise GitHubUrlError("Provide a public GitHub profile URL such as https://github.com/octocat.")
    if parsed.query or parsed.fragment or parsed.params:
        raise GitHubUrlError("GitHub profile URLs cannot include query strings or fragments.")
    parts = [part for part in parsed.path.split("/") if part]
    if len(parts) != 1 or not _GITHUB_USERNAME.fullmatch(parts[0]):
        raise GitHubUrlError("Provide a GitHub profile URL containing one valid username.")
    username = parts[0]
    return f"https://github.com/{username}", username


class GitHubApiClient:
    """Small public-only GitHub REST client with explicit failure mapping."""

    def __init__(
        self,
        base_url: str | None = None,
        timeout_seconds: float | None = None,
        transport: httpx.BaseTransport | None = None,
    ) -> None:
        self.base_url = (base_url or settings.github_api_base_url).rstrip("/")
        self.timeout_seconds = timeout_seconds or settings.github_request_timeout_seconds
        self.transport = transport

    def fetch_public_data(self, username: str) -> GitHubPublicData:
        """Fetch public profile metadata and the most recently updated public repositories."""
        headers = {"Accept": "application/vnd.github+json", "User-Agent": "ResumeX-Developer-Intelligence"}
        with httpx.Client(base_url=self.base_url, timeout=self.timeout_seconds, headers=headers, transport=self.transport) as client:
            profile = self._get_json(client, f"/users/{username}")
            repositories = self._get_json(
                client, f"/users/{username}/repos", params={"per_page": 100, "sort": "updated", "direction": "desc"}
            )
        if not isinstance(profile, dict) or not isinstance(repositories, list):
            raise GitHubApiError("GitHub returned an unexpected public profile response.")
        return GitHubPublicData(profile=profile, repositories=[item for item in repositories if isinstance(item, dict)])

    @staticmethod
    def _get_json(client: httpx.Client, path: str, params: dict[str, object] | None = None) -> Any:
        try:
            response = client.get(path, params=params)
        except httpx.HTTPError as error:
            raise GitHubApiError("GitHub public API is unavailable.") from error
        if response.status_code == 404:
            raise GitHubProfileNotFound("GitHub profile was not found.")
        if response.status_code in {403, 429}:
            raise GitHubRateLimited("GitHub public API rate limit reached. Try again later.")
        if response.is_error:
            raise GitHubApiError("GitHub public API request failed.")
        return response.json()


class GitHubIngestionService:
    """Cache public GitHub data and convert it into attributable developer signals."""

    def __init__(self, api_client: GitHubApiClient | None = None, cache_ttl_seconds: int | None = None) -> None:
        self.api_client = api_client or GitHubApiClient()
        self.cache_ttl_seconds = settings.github_cache_ttl_seconds if cache_ttl_seconds is None else cache_ttl_seconds

    def sync(self, db: Session, candidate_id: object, github_url: str | None = None) -> GitHubProfileSnapshot:
        candidate = db.get(Candidate, candidate_id)
        if candidate is None:
            raise CandidateNotFound("Candidate not found.")
        source_url = github_url or candidate.github_profile_url
        if not source_url:
            raise GitHubUrlError("A GitHub profile URL is required for this candidate.")
        normalized_url, username = normalize_github_profile_url(source_url)
        candidate.github_profile_url = normalized_url

        snapshot = candidate.github_snapshot
        now = datetime.now(timezone.utc)
        if snapshot is not None and snapshot.username.casefold() == username.casefold() and self._is_fresh(snapshot, now):
            self.enrich_snapshot(db, snapshot, now)
            db.flush()
            return snapshot

        public_data = self.api_client.fetch_public_data(username)
        if snapshot is None:
            snapshot = GitHubProfileSnapshot(candidate=candidate, username=username, profile_url=normalized_url, fetched_at=now)
            db.add(snapshot)
        snapshot.username = username
        snapshot.profile_url = normalized_url
        snapshot.profile_name = self._string(public_data.profile.get("name"))
        snapshot.public_repository_count = self._integer(public_data.profile.get("public_repos"))
        snapshot.source = "github_api"
        snapshot.fetched_at = now
        snapshot.payload = self._payload(public_data)
        self.enrich_snapshot(db, snapshot, now)
        db.flush()
        return snapshot

    def enrich_snapshot(self, db: Session, snapshot: GitHubProfileSnapshot, observed_at: datetime | None = None) -> None:
        """Regenerate deterministic signals from an already cached public snapshot."""
        payload = snapshot.payload
        profile = payload.get("profile") if isinstance(payload, dict) else None
        repositories = payload.get("repositories") if isinstance(payload, dict) else None
        public_data = GitHubPublicData(
            profile=profile if isinstance(profile, dict) else {},
            repositories=[repository for repository in repositories if isinstance(repository, dict)]
            if isinstance(repositories, list)
            else [],
        )
        snapshot.signals = self._build_signals(db, snapshot, public_data, observed_at or datetime.now(timezone.utc))

    def _is_fresh(self, snapshot: GitHubProfileSnapshot, now: datetime) -> bool:
        fetched_at = snapshot.fetched_at
        if fetched_at.tzinfo is None:
            fetched_at = fetched_at.replace(tzinfo=timezone.utc)
        return now - fetched_at <= timedelta(seconds=self.cache_ttl_seconds)

    def _build_signals(
        self, db: Session, snapshot: GitHubProfileSnapshot, public_data: GitHubPublicData, observed_at: datetime
    ) -> list[DeveloperSignal]:
        profile_url = snapshot.profile_url
        signals = [
            DeveloperSignal(
                snapshot=snapshot,
                signal_type="github_profile",
                label=snapshot.username,
                source_url=profile_url,
                observed_at=observed_at,
                details={"public_repository_count": snapshot.public_repository_count, "profile_name": snapshot.profile_name},
            )
        ]
        languages: Counter[str] = Counter()
        recent_repository_count = 0
        latest_activity: datetime | None = None
        for repository in public_data.repositories:
            language = self._string(repository.get("language"))
            if language:
                languages[language] += 1
            repository_name = self._string(repository.get("name"))
            if not repository_name:
                continue
            updated_at = self._string(repository.get("updated_at"))
            updated_datetime = self._parse_timestamp(updated_at)
            is_recent = updated_datetime is not None and observed_at - updated_datetime <= timedelta(days=180)
            if is_recent:
                recent_repository_count += 1
            if updated_datetime is not None and (latest_activity is None or updated_datetime > latest_activity):
                latest_activity = updated_datetime
            stars = self._integer(repository.get("stargazers_count"))
            forks = self._integer(repository.get("forks_count"))
            has_description = bool(self._string(repository.get("description")))
            is_archived = bool(repository.get("archived"))
            quality_score = int(has_description) + int(stars > 0) + int(forks > 0) + int(is_recent) + int(not is_archived)
            signals.append(
                DeveloperSignal(
                    snapshot=snapshot,
                    signal_type="github_repository",
                    label=repository_name,
                    source_url=self._string(repository.get("html_url")),
                    observed_at=observed_at,
                    details={
                        "description": self._string(repository.get("description")),
                        "language": language,
                        "stars": stars,
                        "forks": forks,
                        "updated_at": updated_at,
                    },
                )
            )
            signals.append(
                DeveloperSignal(
                    snapshot=snapshot,
                    signal_type="github_repository_quality",
                    label=repository_name,
                    source_url=self._string(repository.get("html_url")),
                    observed_at=observed_at,
                    details={
                        "quality_score": quality_score,
                        "has_description": has_description,
                        "stars": stars,
                        "forks": forks,
                        "recent_activity": is_recent,
                        "archived": is_archived,
                    },
                )
            )
        signals.append(
            DeveloperSignal(
                snapshot=snapshot,
                signal_type="github_activity",
                label="Public repository activity",
                source_url=profile_url,
                observed_at=observed_at,
                details={
                    "public_repository_count": snapshot.public_repository_count,
                    "retrieved_repository_count": len(public_data.repositories),
                    "recent_repository_count": recent_repository_count,
                    "latest_repository_activity": latest_activity.isoformat() if latest_activity else None,
                    "recent_activity_window_days": 180,
                },
            )
        )
        for language, repository_count in sorted(languages.items()):
            definition = normalize_skill(language)
            skill = self._get_or_create_skill(db, definition.name, definition.category) if definition else None
            signals.append(
                DeveloperSignal(
                    snapshot=snapshot,
                    skill=skill,
                    signal_type="github_language",
                    label=definition.name if definition else language,
                    source_url=profile_url,
                    observed_at=observed_at,
                    details={"repository_count": repository_count, "reported_language": language},
                )
            )
        dominant_languages = [language for language, _ in sorted(languages.items(), key=lambda item: (-item[1], item[0]))[:3]]
        signals.append(
            DeveloperSignal(
                snapshot=snapshot,
                signal_type="github_language_breadth",
                label="Language breadth",
                source_url=profile_url,
                observed_at=observed_at,
                details={"language_count": len(languages), "dominant_languages": dominant_languages},
            )
        )
        for language, repository_count in sorted(languages.items(), key=lambda item: (-item[1], item[0]))[:3]:
            definition = normalize_skill(language)
            skill = self._get_or_create_skill(db, definition.name, definition.category) if definition else None
            signals.append(
                DeveloperSignal(
                    snapshot=snapshot,
                    skill=skill,
                    signal_type="github_strength",
                    label=definition.name if definition else language,
                    source_url=profile_url,
                    observed_at=observed_at,
                    details={
                        "basis": "dominant_public_repository_language",
                        "repository_count": repository_count,
                        "reported_language": language,
                        "evidence_scope": "github_public_data_only",
                    },
                )
            )
        return signals

    @staticmethod
    def _get_or_create_skill(db: Session, name: str, category: str) -> Skill:
        skill = db.scalar(select(Skill).where(Skill.name == name))
        if skill is None:
            skill = Skill(name=name, category=category)
            db.add(skill)
        return skill

    @staticmethod
    def _payload(public_data: GitHubPublicData) -> dict[str, object]:
        profile = public_data.profile
        return {
            "profile": {key: profile.get(key) for key in ("login", "name", "html_url", "public_repos", "updated_at")},
            "repositories": [
                {
                    key: repository.get(key)
                    for key in (
                        "name", "html_url", "description", "language", "stargazers_count", "forks_count",
                        "updated_at", "archived", "fork", "size", "open_issues_count",
                    )
                }
                for repository in public_data.repositories
            ],
        }

    @staticmethod
    def _parse_timestamp(value: str | None) -> datetime | None:
        if value is None:
            return None
        try:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
        return parsed if parsed.tzinfo is not None else parsed.replace(tzinfo=timezone.utc)

    @staticmethod
    def _string(value: object) -> str | None:
        return value if isinstance(value, str) else None

    @staticmethod
    def _integer(value: object) -> int:
        return value if isinstance(value, int) else 0
