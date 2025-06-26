from fastapi import APIRouter, HTTPException, Depends, status
from app.dto.chat_dto import (
    ChatRequest,
    ChatResponse,
    MessageDTO,
    MessageResponse,
)
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types
from app.agents import get_chat_agent
from app.repositories.implementations import ChatRepository
from app.api.dependencies import get_chat_repository
from app.core.responses import create_response, create_error_response
from app.models.chat import Chat
from app.core.langfuse.client import flush_langfuse
from langfuse import observe
from settings import settings

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/health")
def health_check():
    """Check if the chat router is operational."""
    return create_response(message="Chat router is healthy", success=True)


@router.get("/{chat_id}")
async def get_chat(
    chat_id: str, chat_repo: ChatRepository = Depends(get_chat_repository)
):
    """
    Retrieve a chat session by its ID.
    """
    try:
        chat = await chat_repo.find_by_id(chat_id)
        if not chat:
            return create_error_response(
                code="chat_not_found",
                message="Chat session not found",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        chat = ChatResponse(
            id=str(chat.id),
            title=chat.title,
            user_id=str(chat.user_id),
            messages=[
                MessageDTO(**message.model_dump(by_alias=True))
                for message in chat.messages
            ],
        )

        return create_response(message="Chat retrieved successfully", data=chat)
    except Exception as e:
        return create_error_response(
            code="get_chat_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_chat(chat_repo: ChatRepository = Depends(get_chat_repository)):
    """
    Create a new chat session.
    """
    try:
        # Create a new chat
        chat = Chat(title="New Chat", user_id="123")

        initial_message = "Hello! I am CodeBuddy. I am here to help you with your coding tasks. How can I assist you today?"

        chat.add_message(role="assistant", content=initial_message)

        created_chat = await chat_repo.create(chat)

        created_chat = ChatResponse(
            title=created_chat.title,
            id=str(created_chat.id),
            user_id=str(created_chat.user_id),
            messages=[
                MessageDTO(**message.model_dump(by_alias=True))
                for message in created_chat.messages
            ],
        )

        return create_response(message="Chat created successfully", data=created_chat)
    except Exception as e:
        return create_error_response(
            code="create_chat_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.post("/{chat_id}/message", status_code=status.HTTP_201_CREATED)
@observe(name="chat_message_processing")
async def add_message(
    chat_id: str,
    request: ChatRequest,
    chat_repo: ChatRepository = Depends(get_chat_repository),
):
    """
    Add a message to an existing chat session and get AI response.
    """
    try:
        # Get the chat
        chat = await chat_repo.find_by_id(chat_id)
        if not chat:
            return create_error_response(
                code="chat_not_found",
                message="Chat session not found",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        # Add user message
        chat.add_message(role="user", content=request.message)

        # Generate AI response
        ai_response = await generate_ai_response(request)
        assistant_message = chat.add_message(role="assistant", content=ai_response)

        # Update the chat
        await chat_repo.update(chat_id, chat)
        
        # Flush Langfuse events
        flush_langfuse()

        assistant_message = MessageResponse(
            role=assistant_message.role,
            content=assistant_message.content,
            timestamp=assistant_message.timestamp,
        )

        return create_response(
            message="Message added successfully", data=assistant_message
        )
    except Exception as e:
        return create_error_response(
            code="add_message_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@observe(name="ai_response_generation")
async def generate_ai_response(request: ChatRequest) -> str:
    """
    Generate AI response using the chat agent with MCP connection parameters.
    """
    try:
        session_service = InMemorySessionService()
        session = await session_service.create_session(
            app_name=settings.application_name,
            user_id="123",
        )

        content = types.Content(role="user", parts=[types.Part(text=request.message)])

        runner = Runner(
            agent=get_chat_agent(request),
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
                last_final_response = (
                    final_response["response"]
                    if isinstance(final_response, dict) and "response" in final_response
                    else final_response
                )

        if last_final_response is not None:
            return last_final_response

        return "I'm sorry, I couldn't generate a response."

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
