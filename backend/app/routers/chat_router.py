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

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    query: str


class ChatResponse(BaseModel):
    response: str


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


@router.post("/{chat_id}/message")
async def send_message(chat_id: str, request: ChatRequest):
    """
    Send a message to the chat session.
    """
    # verify that chat_id is from right user
    # get chat by chat_id from chats collection
    # append message to chat messages

    # get the root agent for the chat session
    root_agent = get_root_agent(chat_id)
    if not root_agent:
        raise HTTPException(status_code=404, detail="Chat session not found")

    # create a session service for the chat
    session_service = InMemorySessionService()

    # create a runner for the root agent
    runner = Runner(
        agent=root_agent,
        session_service=session_service,
        model="gemini-2.0-flash",
        temperature=0.2,
    )

    # run the agent with the user's query
    response = await runner.run(request.query)
    if not response:
        raise HTTPException(status_code=500, detail="Failed to process the message")

    # append the response to the chat messages

    if isinstance(response, types.Response):
        response_text = response.text
    else:
        response_text = str(response)

    # Log the response for debugging
    print(f"Response from root agent: {response_text}")

    # Return the response as part of the chat session
    return ChatResponse(response=response_text)
