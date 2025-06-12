from fastapi import APIRouter, HTTPException
from celery.result import AsyncResult
from app.dto.tools_dto import RepoRequest
from app.utils.embedder import process_repository
from app.celery.worker import celery_app

router = APIRouter(prefix="/tools", tags=["tools"])

@router.get("/health", summary="Health Check", tags=["tools"])
def health_check():
    """Check if the tools router is operational."""
    return {"message": "Tools router is healthy", "status": "ok"}


@router.post("/setup", summary="Setup Repository", tags=["tools"])
async def setup_repo(request: RepoRequest):
    """
    Initiate repository processing as a background Celery task.
    """
    user_id = "123"  # Replace with actual user identification logic
    try:
        task = process_repository.delay(user_id, request.repo_url, request.access_token)
        return {"status": "processing", "task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to start repository processing task.")


@router.get("/task-status/{task_id}", summary="Get Task Status", tags=["tools"])
def get_task_status(task_id: str):
    """
    Retrieve the status of a Celery background task.
    """
    result = AsyncResult(task_id, app=celery_app)
    return {"task_id": task_id, "status": result.status}
