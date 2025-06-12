from fastapi import APIRouter, HTTPException
from app.dto.diagram_dto import DiagramRequest, DiagramResponse
from app.agents.root_agent import get_root_agent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types
from app.agents import diagram_agent

router = APIRouter(prefix="/diagram", tags=["diagram"])


@router.get("/health")
def health_check():
    return {"message": "Diagram router is healthy", "status": "ok"}, 200

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
