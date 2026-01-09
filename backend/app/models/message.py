"""
Message model for chat messages
"""
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .conversation import Conversation


class SenderType(str, Enum):
    """Sender type enumeration"""

    USER = "user"
    ASSISTANT = "assistant"


class Message(SQLModel, table=True):
    """Message entity - represents a single message in a conversation"""

    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversations.id", index=True)
    sender_type: SenderType
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")
