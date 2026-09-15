"""End-to-end screening workflow endpoint."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.screening_response import build_screening_workflow_response
from app.db.session import get_db
from app.schemas.screening import ScreeningWorkflowResponse
from app.api.evaluation_report_response import build_evaluation_report_response
from app.schemas.report import EvaluationReportResponse
from app.services.evaluation_report import EvaluationReportNotFound, EvaluationReportService
from app.services.screening_workflow import ScreeningWorkflowNotFound, ScreeningWorkflowService


router = APIRouter(tags=["screenings"])


@router.post("/screenings/jobs/{job_id}/resumes/{resume_id}", response_model=ScreeningWorkflowResponse)
def run_screening_workflow(
    job_id: UUID,
    resume_id: UUID,
    db: Annotated[Session, Depends(get_db)],
) -> ScreeningWorkflowResponse:
    """Run and persist resume intelligence, vector refresh, and explainable job screening."""
    try:
        return build_screening_workflow_response(ScreeningWorkflowService().run(db, job_id, resume_id))
    except ScreeningWorkflowNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/jobs/{job_id}/resumes/{resume_id}/report", response_model=EvaluationReportResponse)
def get_evaluation_report(
    job_id: UUID,
    resume_id: UUID,
    db: Annotated[Session, Depends(get_db)],
) -> EvaluationReportResponse:
    """Return an explainable read-only aggregation of persisted screening data."""
    try:
        return build_evaluation_report_response(EvaluationReportService().run(db, job_id, resume_id))
    except EvaluationReportNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
