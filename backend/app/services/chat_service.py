"""
Chat service for conversation management and AI interaction
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models import Conversation, Message, SenderType
from app.schemas import (
    ChatMessageRequest,
    ChatMessageResponse,
    MessageResponse,
    TaskActionResponse,
    ConversationResponse,
    ChatHistoryResponse,
    TaskResponse,
)
from app.agents import get_ai_coordinator


class ChatService:
    """Service for chat operations and conversation management"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def process_message(
        self,
        user_id: UUID,
        request: ChatMessageRequest,
    ) -> ChatMessageResponse:
        """Process a chat message and return AI response"""

        # Get or create conversation
        conversation = await self._get_or_create_conversation(
            user_id, request.conversation_id
        )

        # Save user message
        user_message = Message(
            conversation_id=conversation.id,
            sender_type=SenderType.USER,
            content=request.message,
        )
        self.session.add(user_message)
        await self.session.flush()
        await self.session.refresh(user_message)

        # Get conversation history for context
        history = await self._get_conversation_history(conversation.id)

        # Process with AI coordinator
        coordinator = get_ai_coordinator(self.session, user_id)
        response_text, task_action = await coordinator.process_message(
            request.message, history
        )

        # Save assistant message
        assistant_message = Message(
            conversation_id=conversation.id,
            sender_type=SenderType.ASSISTANT,
            content=response_text,
        )
        self.session.add(assistant_message)

        # Update conversation timestamp
        conversation.updated_at = datetime.utcnow()

        await self.session.flush()
        await self.session.refresh(assistant_message)

        # Build task action response if applicable
        task_action_response = None
        if task_action:
            task_action_response = self._build_task_action_response(task_action)

        return ChatMessageResponse(
            user_message=MessageResponse.model_validate(user_message),
            assistant_message=MessageResponse.model_validate(assistant_message),
            task_action=task_action_response,
        )

    async def get_chat_history(
        self,
        user_id: UUID,
        limit: int = 10,
    ) -> ChatHistoryResponse:
        """Get user's conversation history"""

        statement = (
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.updated_at.desc())
            .limit(limit)
        )
        result = await self.session.execute(statement)
        conversations = result.scalars().all()

        # Count total conversations
        count_statement = select(Conversation).where(Conversation.user_id == user_id)
        count_result = await self.session.execute(count_statement)
        total = len(count_result.scalars().all())

        # Build response with messages
        conversation_responses = []
        for conv in conversations:
            # Get messages for this conversation
            messages_statement = (
                select(Message)
                .where(Message.conversation_id == conv.id)
                .order_by(Message.created_at.asc())
            )
            messages_result = await self.session.execute(messages_statement)
            messages = messages_result.scalars().all()

            conversation_responses.append(
                ConversationResponse(
                    id=conv.id,
                    user_id=conv.user_id,
                    created_at=conv.created_at,
                    updated_at=conv.updated_at,
                    messages=[MessageResponse.model_validate(m) for m in messages],
                )
            )

        return ChatHistoryResponse(
            conversations=conversation_responses,
            total=total,
        )

    async def get_conversation(
        self,
        user_id: UUID,
        conversation_id: UUID,
    ) -> Optional[ConversationResponse]:
        """Get a specific conversation with messages"""

        statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
        result = await self.session.execute(statement)
        conversation = result.scalar_one_or_none()

        if not conversation:
            return None

        # Get messages
        messages_statement = (
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .order_by(Message.created_at.asc())
        )
        messages_result = await self.session.execute(messages_statement)
        messages = messages_result.scalars().all()

        return ConversationResponse(
            id=conversation.id,
            user_id=conversation.user_id,
            created_at=conversation.created_at,
            updated_at=conversation.updated_at,
            messages=[MessageResponse.model_validate(m) for m in messages],
        )

    async def clear_chat_history(self, user_id: UUID) -> bool:
        """Clear all conversations for a user"""

        # Get all conversations
        statement = select(Conversation).where(Conversation.user_id == user_id)
        result = await self.session.execute(statement)
        conversations = result.scalars().all()

        # Delete all messages and conversations
        for conv in conversations:
            # Delete messages
            messages_statement = select(Message).where(
                Message.conversation_id == conv.id
            )
            messages_result = await self.session.execute(messages_statement)
            messages = messages_result.scalars().all()

            for message in messages:
                await self.session.delete(message)

            # Delete conversation
            await self.session.delete(conv)

        await self.session.flush()
        return True

    async def _get_or_create_conversation(
        self,
        user_id: UUID,
        conversation_id: Optional[UUID] = None,
    ) -> Conversation:
        """Get existing conversation or create new one"""

        if conversation_id:
            statement = select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id,
            )
            result = await self.session.execute(statement)
            conversation = result.scalar_one_or_none()

            if conversation:
                return conversation

        # Create new conversation
        conversation = Conversation(user_id=user_id)
        self.session.add(conversation)
        await self.session.flush()
        await self.session.refresh(conversation)
        return conversation

    async def _get_conversation_history(
        self,
        conversation_id: UUID,
        limit: int = 20,
    ) -> list[dict]:
        """Get conversation history formatted for AI context"""

        statement = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .limit(limit)
        )
        result = await self.session.execute(statement)
        messages = result.scalars().all()

        # Reverse to get chronological order and format for OpenAI
        history = []
        for message in reversed(messages):
            role = "user" if message.sender_type == SenderType.USER else "assistant"
            history.append({"role": role, "content": message.content})

        return history

    def _build_task_action_response(
        self, task_action: dict
    ) -> Optional[TaskActionResponse]:
        """Build TaskActionResponse from task action dict"""

        action = task_action.get("action")

        if action == "listed":
            tasks = task_action.get("tasks", [])
            task_responses = []
            for t in tasks:
                task_responses.append(
                    TaskResponse(
                        id=UUID(t["id"]),
                        user_id=UUID("00000000-0000-0000-0000-000000000000"),  # Placeholder
                        title=t["title"],
                        status=t["status"],
                        priority=t["priority"],
                        due_date=None,
                        tags=t.get("tags", []),
                        is_recurring=False,
                        recurrence_pattern=None,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow(),
                    )
                )
            return TaskActionResponse(
                action=action,
                tasks=task_responses,
                message=f"Found {len(tasks)} tasks",
            )

        elif action in ["created", "completed", "updated", "deleted"]:
            task_data = task_action.get("task", {})
            task_response = TaskResponse(
                id=UUID(task_data.get("id", "00000000-0000-0000-0000-000000000000")),
                user_id=UUID("00000000-0000-0000-0000-000000000000"),  # Placeholder
                title=task_data.get("title", ""),
                status=task_data.get("status", "pending"),
                priority=task_data.get("priority", "medium"),
                due_date=None,
                tags=[],
                is_recurring=False,
                recurrence_pattern=None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            return TaskActionResponse(
                action=action,
                task=task_response,
                message=f"Task {action}",
            )

        return None


def get_chat_service(session: AsyncSession) -> ChatService:
    """Factory function to get ChatService instance"""
    return ChatService(session)
