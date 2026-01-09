"""
Task model for todo item management
"""
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import ARRAY, TEXT
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class TaskStatus(str, Enum):
    """Task status enumeration"""

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TaskPriority(str, Enum):
    """Task priority enumeration"""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RecurrencePattern(str, Enum):
    """Recurrence pattern for recurring tasks"""

    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class Task(SQLModel, table=True):
    """Task entity - represents a to-do item"""

    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None)
    status: TaskStatus = Field(default=TaskStatus.PENDING)
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)
    due_date: Optional[datetime] = Field(default=None)
    tags: list[str] = Field(default_factory=list, sa_column=Column(ARRAY(TEXT)))
    is_recurring: bool = Field(default=False)
    recurrence_pattern: Optional[RecurrencePattern] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="tasks")
