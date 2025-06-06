from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.embedder import process_repository
from celery.result import AsyncResult
from app.celery.worker import celery_app
from app.agents.root_agent import get_root_agent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types
from google.adk.models.lite_llm import LiteLlm

router = APIRouter(prefix="/diagram", tags=["diagram"])


class DiagramRequest(BaseModel):
    query: str


class DiagramResponse(BaseModel):
    diagram_mermaid: str


@router.get("/health")
def health_check():
    return {"message": "Diagram router is healthy", "status": "ok"}, 200


@router.post("/generate")
async def generate_diagram(request: DiagramRequest):
    """
    Generate a diagram based on the user's query.

    Request Body:
    {
        "query": string  // The user's query for diagram generation
    }
    """
    # Get the root agent for the current user session
    root_agent = get_root_agent()
    if not root_agent:
        raise HTTPException(status_code=404, detail="Root agent not found")

    # Create a session service for the chat
    session_service = InMemorySessionService()

    # Create a runner for the root agent
    runner = Runner(
        agent=root_agent,
        session_service=session_service,
        model="gemini-2.0-flash",
        temperature=0.2,
    )

    # Run the agent with the user's query to generate a diagram
    response = await runner.run(request.query)

    return DiagramResponse(diagram_mermaid=response)


@router.patch("/update/{diagram_id}")
async def update_diagram(request: DiagramRequest):
    """
    Update an existing diagram based on the user's query.

    Request Body:
    {
        "query": string  // The user's query for updating the diagram
    }
    """
    # Get the root agent for the current user session
    root_agent = get_root_agent()
    if not root_agent:
        raise HTTPException(status_code=404, detail="Root agent not found")

    # Create a session service for the chat
    session_service = InMemorySessionService()

    # Create a runner for the root agent
    runner = Runner(
        agent=root_agent,
        session_service=session_service,
        model="gemini-2.0-flash",
        temperature=0.2,
    )

    # Run the agent with the user's query to update a diagram
    response = await runner.run(request.query)

    return DiagramResponse(diagram_mermaid=response)


@router.get("/diagram/{diagram_id}")
async def get_diagram(diagram_id: str):
    """
    Retrieve a diagram by its ID.

    Path Parameter:
    - diagram_id: The ID of the diagram to retrieve
    """
    # This is a placeholder for actual diagram retrieval logic
    # In a real application, you would fetch the diagram from a database or storage
    return {"diagram_id": diagram_id, "message": "Diagram retrieved successfully"}
