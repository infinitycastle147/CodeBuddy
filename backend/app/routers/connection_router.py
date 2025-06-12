from fastapi import APIRouter, HTTPException
from app.utils.embedder import process_repository
from celery.result import AsyncResult
from app.celery.worker import celery_app
from app.dto.connection_dto import (
    GithubConnectionRequest,
    JiraConnectionRequest,
    ConnectionResponse,
)

router = APIRouter(prefix="/connection", tags=["connection"])


@router.get("/health")
def health_check():
    return {"message": "Connection router is healthy", "status": "ok"}, 200


@router.post("/github")
async def connect_github(request: GithubConnectionRequest):
    """
    Connect to a GitHub repository.

    Request Body:
    {
        "repo_url": string,  // The URL of the GitHub repository
        "access_token": string | null  // Optional access token for private repositories
    }
    """
    user_id = "123"
    try:
        task = process_repository.delay(user_id, request.repo_url, request.access_token)
        return ConnectionResponse(
            status="processing", message=f"Task started with ID: {task.id}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/task-status/{task_id}")
def get_task_status(task_id: str):
    """
    Get the status of a background task.

    Path Parameter:
    - task_id: The ID of the task to check
    """
    result = AsyncResult(task_id, app=celery_app)
    return {"task_id": task_id, "status": result.status}


@router.post("/jira")
async def connect_jira(request: JiraConnectionRequest):
    """
    Connect to a Jira instance.

    Request Body:
    {
        "jira_url": string,  // The URL of the Jira instance
        "username": string,  // The username for Jira authentication
        "api_token": string  // The API token for Jira authentication
    }
    """
    # Here you would implement the logic to connect to Jira using the provided credentials.
    # This is a placeholder response.
    return ConnectionResponse(
        status="connected", message="Connected to Jira successfully"
    )


@router.post("/test")
async def test_connection(type: str):
    """
    Test a connection to an external service.

    Query Parameter:
    - type: The type of connection to test (e.g., "github", "jira")
    """
    if type == "github":
        # Implement GitHub connection test logic here
        return ConnectionResponse(
            status="success", message="GitHub connection test successful"
        )
    elif type == "jira":
        # Implement Jira connection test logic here
        return ConnectionResponse(
            status="success", message="Jira connection test successful"
        )
    else:
        raise HTTPException(status_code=400, detail="Unsupported connection type")
