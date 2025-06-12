from fastapi import APIRouter, HTTPException
from app.dto.chat_dto import ChatRequest
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types
from app.agents import chat_agent

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/health")
def health_check():
    return {"message": "Chat router is healthy", "status": "ok"}, 200


@router.get("/{chat_id}")
async def get_chat(chat_id: str):
    """
    Retrieve a chat session by its ID.
    """
    # verify that chat_id is from right user
    # get chat by chat_id from chats collection

    return {"chat_id": chat_id, "message": "Chat retrieved successfully"}


# Chat Agent Endpoint
@router.post("/{chat_id}/message")
async def chat(request: ChatRequest):
    """
    Chat endpoint for interacting with the AI assistant using the chat agent.
    """
    try:
        session_service = InMemorySessionService()
        session = await session_service.create_session(
            app_name="codebuddy",
            user_id="123",
        )

        content = types.Content(role="user", parts=[types.Part(text=request.query)])

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
