"""Candidate developer-intelligence endpoints."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.core import Candidate, DeveloperSignal, GitHubProfileSnapshot
from app.schemas.github import DeveloperIntelligenceResponse, DeveloperSignalResponse, GitHubSyncRequest
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
        )
    return DeveloperIntelligenceResponse(
        candidate_id=candidate.id,
        github_profile_url=candidate.github_profile_url,
        username=snapshot.username,
        profile_name=snapshot.profile_name,
        public_repository_count=snapshot.public_repository_count,
        source=snapshot.source,
        fetched_at=snapshot.fetched_at,
        signals=[
            DeveloperSignalResponse(
                id=signal.id,
                signal_type=signal.signal_type,
                label=signal.label,
                normalized_skill=signal.skill.name if signal.skill else None,
                source_url=signal.source_url,
                observed_at=signal.observed_at,
                details=signal.details,
            )
            for signal in snapshot.signals
        ],
    )
