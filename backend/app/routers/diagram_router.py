from fastapi import APIRouter, HTTPException, Depends, status
from app.dto.diagram_dto import DiagramRequest, DiagramResponse
from app.models.diagram import Diagram
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types
from app.agents import diagram_agent
from app.repositories.implementations import DiagramRepository
from app.api.dependencies import get_diagram_repository
from app.core.responses import create_response, create_error_response
from typing import List

router = APIRouter(prefix="/diagram", tags=["diagram"])

@router.get("/health")
def health_check():
    return create_response(message="Diagram router is healthy")

@router.get("/{diagram_id}")
async def get_diagram(
    diagram_id: str,
    diagram_repo: DiagramRepository = Depends(get_diagram_repository)
):
    """Get a diagram by its ID."""
    try:
        diagram = await diagram_repo.find_by_id(diagram_id)

        diagram = DiagramResponse(**diagram) if diagram else None

        if not diagram:
            return create_error_response(
                code="diagram_not_found",
                message="Diagram not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        return create_response(
            message="Diagram retrieved successfully",
            data=diagram
        )
    except Exception as e:
        return create_error_response(
            code="get_diagram_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@router.get("/")
async def list_diagrams(
    diagram_repo: DiagramRepository = Depends(get_diagram_repository)
):
    """List all diagrams."""
    try:
        diagrams = await diagram_repo.find_all()

        if not diagrams:
            return create_response(
                message="No diagrams found",
                data=[]
            )
        
        diagrams = [DiagramResponse(**diagram) for diagram in diagrams]

        return create_response(
            message="Diagrams retrieved successfully",
            data=diagrams
        )
    except Exception as e:
        return create_error_response(
            code="list_diagrams_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Diagram Generation Endpoint
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_diagram(
    request: DiagramRequest,
    diagram_repo: DiagramRepository = Depends(get_diagram_repository)
):
    """
    Generate a diagram based on user input using the diagram agent.
    """
    try:
        # Generate diagram content using AI
        diagram_content = await generate_diagram_content(request.user_input)
        
        # Create a new diagram
        diagram = Diagram(
            title=request.title or "New Diagram",
            content=diagram_content
        )
        
        # Save the diagram
        created_diagram = await diagram_repo.create(diagram.dict(by_alias=True))

        created_diagram = DiagramResponse(**created_diagram)
        
        return create_response(
            message="Diagram created successfully",
            data=created_diagram
        )
    except Exception as e:
        return create_error_response(
            code="create_diagram_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@router.patch("/{diagram_id}")
async def update_diagram(
    diagram_id: str,
    request: DiagramRequest,
    diagram_repo: DiagramRepository = Depends(get_diagram_repository)
):
    """
    Update an existing diagram based on the user's input.
    """
    try:
        # Check if diagram exists
        existing_diagram = await diagram_repo.find_by_id(diagram_id)
        if not existing_diagram:
            return create_error_response(
                code="diagram_not_found",
                message="Diagram not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Update diagram fields if provided
        if request.title:
            existing_diagram.title = request.title
        if request.description:
            existing_diagram.description = request.description
        
        # If user input is provided, regenerate diagram content
        if request.user_input:
            existing_diagram.content = await generate_diagram_content(request.user_input)
        
        # Update the diagram
        updated_diagram = await diagram_repo.update(
            diagram_id, existing_diagram.dict(by_alias=True)
        )

        updated_diagram = DiagramResponse(**updated_diagram)
        
        return create_response(
            message="Diagram updated successfully",
            data=updated_diagram
        )
    except Exception as e:
        return create_error_response(
            code="update_diagram_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

async def generate_diagram_content(user_input: str) -> str:
    """
    Generate diagram content using the diagram agent.
    """
    try:
        session_service = InMemorySessionService()
        session = await session_service.create_session(
            app_name="codebuddy",
            user_id="123",
        )

        content = types.Content(
            role="user", parts=[types.Part(text=user_input)]
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

        return "No diagram content could be generated."

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

