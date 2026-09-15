"""Candidate developer-intelligence endpoints."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.core import Candidate, DeveloperSignal, GitHubProfileSnapshot
from app.schemas.github import (
    DeveloperIntelligenceResponse,
    DeveloperSignalResponse,
    GitHubActivityResponse,
    GitHubProfileResponse,
    GitHubRepositoryResponse,
    GitHubSourceMetadataResponse,
    GitHubSyncRequest,
)
from app.services.github_intelligence import (
    CandidateNotFound,
    GitHubApiError,
    GitHubIngestionService,
    GitHubProfileNotFound,
    GitHubRateLimited,
    GitHubUrlError,
)


router = APIRouter(tags=["candidates"])


@router.post("/candidates/{candidate_id}/github/sync", response_model=DeveloperIntelligenceResponse)
def sync_github_profile(
    candidate_id: UUID,
    db: Annotated[Session, Depends(get_db)],
    request: GitHubSyncRequest | None = None,
) -> DeveloperIntelligenceResponse:
    """Retrieve and cache public GitHub profile and repository metadata."""
    try:
        snapshot = GitHubIngestionService().sync(db, candidate_id, request.github_profile_url if request else None)
        db.commit()
        return _response(snapshot.candidate, snapshot)
    except CandidateNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except GitHubUrlError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except GitHubProfileNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except GitHubRateLimited as error:
        raise HTTPException(status_code=429, detail=str(error)) from error
    except GitHubApiError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error


@router.get("/candidates/{candidate_id}/developer-intelligence", response_model=DeveloperIntelligenceResponse)
def get_developer_intelligence(
    candidate_id: UUID,
    db: Annotated[Session, Depends(get_db)],
) -> DeveloperIntelligenceResponse:
    """Return the latest cached public developer signals without contacting GitHub."""
    candidate = db.scalar(
        select(Candidate)
        .where(Candidate.id == candidate_id)
        .options(
            selectinload(Candidate.github_snapshot)
            .selectinload(GitHubProfileSnapshot.signals)
            .selectinload(DeveloperSignal.skill)
        )
    )
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    return _response(candidate, candidate.github_snapshot)


def _response(candidate: Candidate, snapshot: GitHubProfileSnapshot | None) -> DeveloperIntelligenceResponse:
    if snapshot is None:
        return DeveloperIntelligenceResponse(
            candidate_id=candidate.id,
            github_profile_url=candidate.github_profile_url,
            username=None,
            profile_name=None,
            public_repository_count=None,
            source=None,
            fetched_at=None,
            signals=[],
            profile=None,
            activity=None,
            repositories=[],
            languages=[],
            strengths=[],
            source_metadata=None,
        )
    responses = [_signal_response(signal) for signal in snapshot.signals]
    by_type: dict[str, list[DeveloperSignalResponse]] = {}
    for signal in responses:
        by_type.setdefault(signal.signal_type, []).append(signal)
    quality_by_repository = {signal.label: signal for signal in by_type.get("github_repository_quality", [])}
    return DeveloperIntelligenceResponse(
        candidate_id=candidate.id,
        github_profile_url=candidate.github_profile_url,
        username=snapshot.username,
        profile_name=snapshot.profile_name,
        public_repository_count=snapshot.public_repository_count,
        source=snapshot.source,
        fetched_at=snapshot.fetched_at,
        signals=responses,
        profile=GitHubProfileResponse(
            username=snapshot.username,
            name=snapshot.profile_name,
            profile_url=snapshot.profile_url,
            public_repository_count=snapshot.public_repository_count,
        ),
        activity=GitHubActivityResponse(signals=by_type.get("github_activity", [])),
        repositories=[
            GitHubRepositoryResponse(repository=repository, quality=quality_by_repository.get(repository.label))
            for repository in by_type.get("github_repository", [])
        ],
        languages=by_type.get("github_language", []) + by_type.get("github_language_breadth", []),
        strengths=by_type.get("github_strength", []),
        source_metadata=GitHubSourceMetadataResponse(
            source=snapshot.source,
            profile_url=snapshot.profile_url,
            fetched_at=snapshot.fetched_at,
            derived_at=max((signal.observed_at for signal in snapshot.signals if signal.observed_at), default=None),
        ),
    )


def _signal_response(signal: DeveloperSignal) -> DeveloperSignalResponse:
    return DeveloperSignalResponse(
        id=signal.id,
        signal_type=signal.signal_type,
        label=signal.label,
        normalized_skill=signal.skill.name if signal.skill else None,
        source_url=signal.source_url,
        observed_at=signal.observed_at,
        details=signal.details,
    )
