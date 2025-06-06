# Standard Library Imports
from typing import Optional

# Third-Party Imports
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from celery.result import AsyncResult
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types

# Application-Specific Imports
from app.utils.embedder import process_repository
from app.celery.worker import celery_app
from app.agents import chat_agent, diagram_agent
from app.utils.xml_converter import convert_xml_to_dict

# Initialize the router with prefix and tags
router = APIRouter(prefix="/tools", tags=["tools"])

# Request Models
class RepoRequest(BaseModel):
    repo_url: str
    access_token: Optional[str] = None


class DiagramRequest(BaseModel):
    user_input: str
    diagram_type: str


class VectorSearchRequest(BaseModel):
    query: str
    top_k: int = 5


class ChatAgentRequest(BaseModel):
    user_input: str


# Health Check Endpoint
@router.get("/health")
def health_check():
    """
    Health check endpoint to verify the router is operational.
    """
    return {"message": "Tools router is healthy", "status": "ok"}, 200


# Repository Setup Endpoint
@router.post("/setup")
async def setup_repo(request: RepoRequest):
    """
    Setup a repository for processing by initiating a Celery task.
    """
    user_id = "123"
    try:
        task = process_repository.delay(user_id, request.repo_url, request.access_token)
        return {"status": "processing", "task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Task Status Endpoint
@router.get("/task-status/{task_id}")
def get_task_status(task_id: str):
    """
    Get the status of a Celery task by its task ID.
    """
    result = AsyncResult(task_id, app=celery_app)
    return {"task_id": task_id, "status": result.status}


# Code Indexing Endpoint
@router.post("/index")
def create_code_index(repo_url: str):
    """
    Start the process of crawling the repository, building embeddings, and creating a search index.
    """
    return {"message": "Indexing started for repo", "repo_url": repo_url}


# Chat Agent Endpoint
@router.post("/chat")
async def chat(request: ChatAgentRequest):
    """
    Chat endpoint for interacting with the AI assistant using the chat agent.
    """
    try:
        session_service = InMemorySessionService()
        session = await session_service.create_session(
            app_name="codebuddy",
            user_id="123",
        )

        content = types.Content(
            role="user", parts=[types.Part(text=request.user_input)]
        )

        runner = Runner(
            agent=chat_agent, app_name="codebuddy", session_service=session_service
        )

        events = runner.run_async(
            user_id=session.user_id, session_id=session.id, new_message=content
        )

        last_final_response = None

        async for event in events:
            if event.is_final_response() and event.content and event.content.parts:
                final_response = event.content.parts[0].text
                last_final_response = (
                    final_response["response"]
                    if isinstance(final_response, dict) and "response" in final_response
                    else final_response
                )

        if last_final_response is not None:
            return last_final_response

        return {"result": "No final response from agent."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Diagram Generation Endpoint
@router.post("/diagram")
async def generate_diagram(request: DiagramRequest):
    """
    Generate a diagram based on user input using the diagram agent.
    """
    try:
        session_service = InMemorySessionService()
        session = await session_service.create_session(
            app_name="codebuddy",
            user_id="123",
        )

        content = types.Content(
            role="user", parts=[types.Part(text=request.user_input)]
        )

        runner = Runner(
            agent=diagram_agent, app_name="codebuddy", session_service=session_service
        )

        events = runner.run_async(
            user_id=session.user_id, session_id=session.id, new_message=content
        )

        last_final_response = None

        async for event in events:
            if event.is_final_response() and event.content and event.content.parts:
                final_response = event.content.parts[0].text
                last_final_response = (
                    final_response["response"]
                    if isinstance(final_response, dict) and "response" in final_response
                    else final_response
                )

        if last_final_response is not None:
            return last_final_response

        return {"result": "No final response from agent."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
