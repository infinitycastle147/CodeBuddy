from fastapi import APIRouter, status, Depends
from typing import Annotated
from app.core.responses import create_error_response, create_response
from celery.result import AsyncResult
from app.dto.tools_dto import RepoRequest
from app.utils.embedder import process_repository
from app.celery.worker import celery_app
from app.models.user import User
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/tools", tags=["tools"])


@router.get("/health", summary="Health Check", tags=["tools"])
def health_check():
    """Check if the tools router is operational."""
    return create_response(message="Tools router is healthy", success=True)


@router.post("/setup", summary="Setup Repository", tags=["tools"])
async def setup_repo(
    request: RepoRequest,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Initiate repository processing as a background Celery task for the current user.
    """
    try:
        task = process_repository.delay(str(current_user.id), request.repo_url, request.access_token)
        return create_response(
            message="Repository setup started", data={"task_id": task.id}, success=True
        )
    except Exception as e:
        return create_error_response(
            code=500,
            message="Failed to start repository processing task.",
            details=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@router.get("/task-status/{task_id}", summary="Get Task Status", tags=["tools"])
def get_task_status(task_id: str):
    """
    Retrieve the status of a Celery background task.
    """
    result = AsyncResult(task_id, app=celery_app)
    return create_response(
        message="Task status fetched",
        data={"task_id": task_id, "status": result.status},
        success=True,
    )
