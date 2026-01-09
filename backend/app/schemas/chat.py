"""
Chat Pydantic schemas
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.message import SenderType
from app.schemas.task import TaskResponse


class ChatMessageRequest(BaseModel):
    """Schema for chat message request"""

    message: str = Field(..., min_length=1, max_length=2000)
    conversation_id: Optional[UUID] = Field(default=None, alias="conversationId")

    model_config = {"populate_by_name": True}


class MessageResponse(BaseModel):
    """Schema for message response"""

    id: UUID
    conversation_id: UUID = Field(..., serialization_alias="conversationId")
    sender_type: SenderType = Field(..., serialization_alias="senderType")
    content: str
    created_at: datetime = Field(..., serialization_alias="createdAt")

    model_config = {"from_attributes": True, "populate_by_name": True}


class TaskActionResponse(BaseModel):
    """Schema for task action performed by AI"""

    action: str  # created, updated, completed, deleted, listed
    task: Optional[TaskResponse] = None
    tasks: Optional[list[TaskResponse]] = None
    message: Optional[str] = None


class ChatMessageResponse(BaseModel):
    """Schema for chat message response"""

    user_message: MessageResponse = Field(..., serialization_alias="userMessage")
    assistant_message: MessageResponse = Field(..., serialization_alias="assistantMessage")
    task_action: Optional[TaskActionResponse] = Field(default=None, serialization_alias="taskAction")

    model_config = {"populate_by_name": True}


class ConversationResponse(BaseModel):
    """Schema for conversation response"""

    id: UUID
    user_id: UUID = Field(..., serialization_alias="userId")
    created_at: datetime = Field(..., serialization_alias="createdAt")
    updated_at: datetime = Field(..., serialization_alias="updatedAt")
    messages: list[MessageResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True, "populate_by_name": True}


class ChatHistoryResponse(BaseModel):
    """Schema for chat history response"""

    conversations: list[ConversationResponse]
    total: int
