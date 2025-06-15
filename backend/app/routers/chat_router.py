from fastapi import APIRouter, HTTPException, Depends, status
from app.dto.chat_dto import (
    ChatRequest,
    CreateChatRequest,
    ChatResponse,
    MessageResponse,
)
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types
from app.agents import chat_agent
from app.repositories.implementations import ChatRepository
from app.api.dependencies import get_chat_repository
from app.core.responses import create_response, create_error_response
from app.models.chat import Chat

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/health")
def health_check():
    return create_response(message="Chat router is healthy")


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

        chat = ChatResponse(**chat.model_dump(by_alias=True))

        return create_response(message="Chat retrieved successfully", data=chat)
    except Exception as e:
        return create_error_response(
            code="get_chat_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_chat(
    request: CreateChatRequest, chat_repo: ChatRepository = Depends(get_chat_repository)
):
    """
    Create a new chat session.
    """
    try:
        # Create a new chat
        chat = Chat(title=request.title)

        # Add initial message if provided
        if request.initial_message:
            chat.add_message(role="user", content=request.initial_message)

            # Generate AI response to initial message
            ai_response = await generate_ai_response(request.initial_message)
            chat.add_message(role="assistant", content=ai_response)

        # Save the chat
        created_chat = await chat_repo.create(chat.dict(by_alias=True))

        created_chat = ChatResponse(**created_chat)

        return create_response(message="Chat created successfully", data=created_chat)
    except Exception as e:
        return create_error_response(
            code="create_chat_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.post("/{chat_id}/message")
async def add_message(
    chat_id: str,
    request: ChatRequest,
    chat_repo: ChatRepository = Depends(get_chat_repository),
):
    """
    Add a message to an existing chat and get AI response.
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
        user_message = chat.add_message(role="user", content=request.message)

        # Generate AI response
        ai_response = await generate_ai_response(request.message, chat)
        assistant_message = chat.add_message(role="assistant", content=ai_response)

        # Update the chat
        await chat_repo.update(chat_id, chat.dict(by_alias=True))

        assistant_message = MessageResponse(
            **assistant_message.model_dump(by_alias=True)
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


@router.get("/")
async def list_chats(chat_repo: ChatRepository = Depends(get_chat_repository)):
    """
    List all chat sessions.
    """
    try:
        chats = await chat_repo.find_all()
        if not chats:
            return create_response(message="No chat sessions found", data=[])
        chats = [ChatResponse(**chat) for chat in chats]
        return create_response(message="Chats retrieved successfully", data=chats)
    except Exception as e:
        return create_error_response(
            code="list_chats_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


async def generate_ai_response(message: str, chat: Chat = None) -> str:
    """
    Generate AI response using the chat agent.
    """
    try:
        session_service = InMemorySessionService()
        session = await session_service.create_session(
            app_name="codebuddy",
            user_id="123",
        )

        content = types.Content(role="user", parts=[types.Part(text=message)])

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

        return "I'm sorry, I couldn't generate a response."

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
