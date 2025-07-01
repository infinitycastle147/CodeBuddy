# Standard library imports
import json
from typing import Annotated

# FastAPI imports
from fastapi import APIRouter, HTTPException, Depends, status

# Application imports
from app.agents.agent import get_diagram_agent
from app.agents.diagram_typeDetector_agent import diagram_typeDetector_agent
from app.dto.diagram_dto import DiagramRequest, DiagramResponse, DiagramUpdateRequest
from app.dto.diagram_type_dto import DiagramTypeDetectionRequest, DiagramTypeDetectionResponse
from app.models.diagram import Diagram
from app.models.user import User
from app.repositories.implementations import DiagramRepository
from app.api.dependencies import get_diagram_repository
from app.core.responses import create_response, create_error_response
from app.auth.dependencies import get_current_user
from app.auth.authorization import require_diagram_ownership, get_user_diagrams

# Third-party imports
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types
from langfuse import observe
from settings import settings
from loguru import logger

router = APIRouter(prefix="/diagram", tags=["diagram"])

@router.get("/health")
def health_check() -> dict:
    return create_response(message="Diagram router is healthy", success=True)


@router.post("/detect-type")
@observe(name="diagram_type_detection")
async def detect_diagram_type(
    request: DiagramTypeDetectionRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict:
    """
    Analyze user input and recommend the most appropriate diagram type.
    
    This endpoint uses AI to analyze the user's query and suggest one of 22 supported
    diagram types (flowchart, sequence, class, etc.). The frontend can use this to
    provide users with intelligent diagram type suggestions before generation.
    
    Args:
        request: Contains user input for analysis
        current_user: Authenticated user (required for API access)
        
    Returns:
        dict: Response containing the recommended diagram type
    """
    try:
        # Generate diagram type using AI
        detected_type = await detect_diagram_type_content(request.user_input)
        
        logger.info(f"Detected diagram type: {detected_type}")

        response = DiagramTypeDetectionResponse(diagram_type=detected_type)
        
        return create_response(
            message="Diagram type detected successfully", 
            data=response.dict()
        )
    except Exception as e:
        return create_error_response(
            code="detect_diagram_type_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get("/{diagram_id}")
async def get_diagram(
    diagram: Annotated[Diagram, Depends(require_diagram_ownership)]
):
    """Get a diagram by its ID. Only returns if the current user owns it."""
    try:
        diagram_response = DiagramResponse(
            id=diagram.id,
            user_id=diagram.user_id,
            title=diagram.title,
            type=diagram.type,
            description=diagram.description,
            content=diagram.content,
            created_at=diagram.created_at,
            updated_at=diagram.updated_at,
        )

        return create_response(message="Diagram retrieved successfully", data=diagram_response)
    except Exception as e:
        return create_error_response(
            code="get_diagram_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get("/")
async def list_diagrams(
    user_diagrams: Annotated[list[Diagram], Depends(get_user_diagrams)]
):
    """List all diagrams belonging to the current user."""
    try:
        if not user_diagrams:
            return create_response(message="No diagrams found", data=[])

        diagrams_response = [
            DiagramResponse(
                id=diagram.id,
                user_id=diagram.user_id,
                title=diagram.title,
                type=diagram.type,
                description=diagram.description,
                content=diagram.content,
                created_at=diagram.created_at,
                updated_at=diagram.updated_at,
            )
            for diagram in user_diagrams
        ]

        return create_response(message="Diagrams retrieved successfully", data=diagrams_response)
    except Exception as e:
        return create_error_response(
            code="list_diagrams_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# Diagram Generation Endpoint
@router.post("/", status_code=status.HTTP_201_CREATED)
@observe(name="diagram_creation")
async def create_diagram(
    request: DiagramRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    diagram_repo: Annotated[DiagramRepository, Depends(get_diagram_repository)],
) -> dict:
    """
    Generate a diagram based on user input using the diagram agent.
    """
    try:
        # Generate diagram content using AI
        diagram_content = await generate_diagram_content(request)

        logger.info(f"Diagram content: {diagram_content}")

        # Create a new diagram for the authenticated user
        diagram = Diagram(
            user_id=str(current_user.id),
            title=request.title or "New Diagram",
            type=request.type,
            description=request.description or "Diagram generated by CodeBuddy",
            content=diagram_content,
        )

        # Save the diagram
        created_diagram = await diagram_repo.create(diagram)

        created_diagram = DiagramResponse(
            id=created_diagram.id,
            user_id=created_diagram.user_id,
            title=created_diagram.title,
            type=created_diagram.type,
            description=created_diagram.description,
            content=created_diagram.content,
            created_at=created_diagram.created_at,
            updated_at=created_diagram.updated_at,
        )

        return create_response(
            message="Diagram created successfully", data=created_diagram
        )
    except Exception as e:
        return create_error_response(
            code="create_diagram_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.patch("/{diagram_id}")
@observe(name="diagram_update")
async def update_diagram(
    request: DiagramUpdateRequest,
    diagram: Annotated[Diagram, Depends(require_diagram_ownership)],
    diagram_repo: DiagramRepository = Depends(get_diagram_repository),
):
    """
    Update an existing diagram. Only works if the current user owns it.
    """
    try:
        # Updated diagram
        updated_diagram_content = request.content

        updated_diagram = Diagram(
            id=diagram.id,
            user_id=diagram.user_id,
            title=diagram.title,
            type=diagram.type,
            description=diagram.description,
            content=updated_diagram_content,
        )

        # Update the diagram
        updated_diagram = await diagram_repo.update(str(diagram.id), updated_diagram)

        updated_diagram = DiagramResponse(
            id=updated_diagram.id,
            user_id=updated_diagram.user_id,
            title=updated_diagram.title,
            type=updated_diagram.type,
            description=updated_diagram.description,
            content=updated_diagram.content,
            created_at=updated_diagram.created_at,
            updated_at=updated_diagram.updated_at,
        )

        return create_response(
            message="Diagram updated successfully", data=updated_diagram
        )
    except Exception as e:
        return create_error_response(
            code="update_diagram_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@observe(name="diagram_type_detection")
async def detect_diagram_type_content(user_input: str) -> str:
    """
    Detect diagram type using the diagram type detector agent.
    """
    try:
        session_service = InMemorySessionService()

        session = await session_service.create_session(
            app_name=settings.application_name,
            user_id="123",
        )

        content = types.Content(role="user", parts=[types.Part(text=user_input)])

        runner = Runner(
            agent=diagram_typeDetector_agent,
            app_name=settings.application_name,
            session_service=session_service,
        )

        events = runner.run_async(
            user_id=session.user_id, session_id=session.id, new_message=content
        )

        last_final_response = None

        async for event in events:
            if event.is_final_response() and event.content and event.content.parts:
                final_response = event.content.parts[0].text
                # Convert string response to dict since LLM returns JSON as string
                try:
                    response_dict = json.loads(final_response)
                    last_final_response = response_dict.get("diagram_type", response_dict)
                except json.JSONDecodeError:
                    # Fallback if response is not valid JSON
                    last_final_response = final_response

        if last_final_response is not None:
            return str(last_final_response).strip()

        return "flowchart"  # Default fallback

    except Exception as e:
        return create_error_response


@observe(name="diagram_content_generation")
async def generate_diagram_content(request: DiagramRequest) -> str:
    """
    Generate diagram content using the diagram agent with MCP connection parameters.
    """
    try:
        session_service = InMemorySessionService()

        session = await session_service.create_session(
            app_name=settings.application_name,
            user_id="123",
        )

        content = types.Content(role="user", parts=[types.Part(text=request.user_input)])

        runner = Runner(
            agent=get_diagram_agent(request),
            app_name=settings.application_name,
            session_service=session_service,
        )

        events = runner.run_async(
            user_id=session.user_id, session_id=session.id, new_message=content
        )

        last_final_response = None

        async for event in events:
            if event.is_final_response() and event.content and event.content.parts:
                final_response = event.content.parts[0].text

                # Convert string response to dict since LLM returns JSON as string
                try:
                    response_dict = json.loads(final_response)
                    logger.info(f"Diagram response: {response_dict}")
                    last_final_response = (
                        response_dict["diagram"]
                        if isinstance(response_dict, dict) and "diagram" in response_dict
                        else response_dict
                    )
                except json.JSONDecodeError:
                    # Fallback if response is not valid JSON
                    last_final_response = final_response

        if last_final_response is not None:
            return last_final_response

        return "No diagram content could be generated."

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


