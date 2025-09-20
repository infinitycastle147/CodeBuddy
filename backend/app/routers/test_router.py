import json
import time
from fastapi import APIRouter, HTTPException
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types
from loguru import logger
from pydantic import BaseModel
from app.agents import get_diagram_generation_from_text_agent
from app.core.responses import create_response
from settings import settings

router = APIRouter(prefix="/test", tags=["test"])

class TestRequest(BaseModel):
    query: str
    text: str
    diagram_type: str

@router.post("/")
async def test(request: TestRequest):

    start_time = time.time()

    query = request.query
    text = request.text
    diagram_type = request.diagram_type

    response = await generate_ai_response(query, text, diagram_type)

    logger.debug(f"Test : {time.time() - start_time} seconds")

    return create_response(
        success=True,
        message="AI response generated successfully",
        data=response,
    )


async def generate_ai_response(query: str, text: str, diagram_type: str) -> dict:
    """Generate AI response using the chat agent with MCP connection parameters."""

    try:

        session_service = InMemorySessionService()
        session = await session_service.create_session(
            app_name=settings.application_name,
            user_id="test_user",
        )

        content = types.Content(role="user", parts=[types.Part(text=query)])

        runner = Runner(
            agent=get_diagram_generation_from_text_agent(text, diagram_type),
            app_name=settings.application_name,
            session_service=session_service,
        )

        events = runner.run_async(
            user_id=session.user_id, session_id=session.id, new_message=content
        )

        last_final_response = None

        async for event in events:
            if event.is_final_response() and event.content and event.content.parts:
                last_final_response = parse_ai_response(event.content.parts[0].text)

        if last_final_response is not None:
            return last_final_response

        return {"response" : "I'm sorry, I couldn't generate a response."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def parse_ai_response(response: str) -> dict:
    """Parse the AI response to extract the relevant information."""
    try:

        # if response contains ```json ... ``` extract the json part
        if "```json" in response:
            start_index = response.index("```json") + len("```json")
            end_index = response.index("```", start_index)
            json_str = response[start_index:end_index].strip()
            response = json_str

        # Assuming the response is a JSON string
        response_data = json.loads(response)
        return response_data
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response.")