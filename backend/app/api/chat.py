"""
Chat API endpoints for AI chatbot interaction
"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import CurrentUser, DbSession
from app.schemas import (
    ChatMessageRequest,
    ChatMessageResponse,
    ChatHistoryResponse,
    ConversationResponse,
)
from app.services.chat_service import get_chat_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/message", response_model=ChatMessageResponse, response_model_by_alias=True)
async def send_message(
    request: ChatMessageRequest,
    current_user: CurrentUser,
    session: DbSession,
) -> ChatMessageResponse:
    """
    Send a message to the AI chatbot.

    The chatbot can understand natural language in English and Hinglish,
    and can perform task operations like:
    - Adding new tasks
    - Listing tasks with filters
    - Marking tasks as complete
    - Updating task properties
    - Deleting tasks

    Args:
        request: Chat message with optional conversation_id
        current_user: Authenticated user
        session: Database session

    Returns:
        ChatMessageResponse with user message, assistant response, and optional task action
    """
    chat_service = get_chat_service(session)

    try:
        response = await chat_service.process_message(current_user.id, request)
        await session.commit()
        return response
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process message: {str(e)}",
        )


@router.get("/history", response_model=ChatHistoryResponse, response_model_by_alias=True)
async def get_chat_history(
    current_user: CurrentUser,
    session: DbSession,
    limit: int = 10,
) -> ChatHistoryResponse:
    """
    Get the user's chat conversation history.

    Args:
        current_user: Authenticated user
        session: Database session
        limit: Maximum number of conversations to return (default: 10)

    Returns:
        ChatHistoryResponse with list of conversations and their messages
    """
    chat_service = get_chat_service(session)
    return await chat_service.get_chat_history(current_user.id, limit)


@router.get("/conversation/{conversation_id}", response_model=ConversationResponse, response_model_by_alias=True)
async def get_conversation(
    conversation_id: UUID,
    current_user: CurrentUser,
    session: DbSession,
) -> ConversationResponse:
    """
    Get a specific conversation with all its messages.

    Args:
        conversation_id: ID of the conversation
        current_user: Authenticated user
        session: Database session

    Returns:
        ConversationResponse with conversation details and messages

    Raises:
        HTTPException: If conversation not found
    """
    chat_service = get_chat_service(session)
    conversation = await chat_service.get_conversation(
        current_user.id, conversation_id
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )

    return conversation


@router.delete("/history")
async def clear_chat_history(
    current_user: CurrentUser,
    session: DbSession,
):
    """
    Clear all chat conversations for the current user.

    Args:
        current_user: Authenticated user
        session: Database session

    Returns:
        Success message
    """
    chat_service = get_chat_service(session)

    try:
        await chat_service.clear_chat_history(current_user.id)
        await session.commit()
        return {"message": "Chat history cleared successfully"}
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear chat history: {str(e)}",
        )
