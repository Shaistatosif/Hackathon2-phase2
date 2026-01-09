"""
Task Pydantic schemas
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.models.task import RecurrencePattern, TaskPriority, TaskStatus


class TaskCreateRequest(BaseModel):
    """Schema for task creation request"""

    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = Field(default=None, alias="dueDate")
    tags: list[str] = Field(default_factory=list)
    is_recurring: bool = Field(default=False, alias="isRecurring")
    recurrence_pattern: Optional[RecurrencePattern] = Field(default=None, alias="recurrencePattern")

    model_config = {"populate_by_name": True}

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        return v.strip()

    @field_validator("recurrence_pattern")
    @classmethod
    def validate_recurrence(cls, v: Optional[RecurrencePattern], info) -> Optional[RecurrencePattern]:
        is_recurring = info.data.get("is_recurring", False) or info.data.get("isRecurring", False)
        if is_recurring and v is None:
            raise ValueError("recurrence_pattern is required when is_recurring is True")
        return v


class TaskUpdateRequest(BaseModel):
    """Schema for task update request"""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = Field(default=None, alias="dueDate")
    tags: Optional[list[str]] = None
    is_recurring: Optional[bool] = Field(default=None, alias="isRecurring")
    recurrence_pattern: Optional[RecurrencePattern] = Field(default=None, alias="recurrencePattern")

    model_config = {"populate_by_name": True}

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return v.strip()
        return v


class TaskResponse(BaseModel):
    """Schema for task response"""

    id: UUID
    user_id: UUID = Field(..., serialization_alias="userId")
    title: str
    description: Optional[str] = None
    status: TaskStatus
    priority: TaskPriority
    due_date: Optional[datetime] = Field(default=None, serialization_alias="dueDate")
    tags: list[str] = Field(default_factory=list)
    is_recurring: bool = Field(default=False, serialization_alias="isRecurring")
    recurrence_pattern: Optional[RecurrencePattern] = Field(default=None, serialization_alias="recurrencePattern")
    created_at: datetime = Field(..., serialization_alias="createdAt")
    updated_at: datetime = Field(..., serialization_alias="updatedAt")

    model_config = {"from_attributes": True, "populate_by_name": True}


class TaskListResponse(BaseModel):
    """Schema for task list response with pagination"""

    tasks: list[TaskResponse]
    total: int
    page: int
    page_size: int = Field(..., serialization_alias="pageSize")

    model_config = {"populate_by_name": True}


class TaskFilterParams(BaseModel):
    """Schema for task filter parameters"""

    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    search: Optional[str] = None
    sort_by: str = Field(default="created_at", alias="sortBy")
    sort_order: str = Field(default="desc", alias="sortOrder")
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100, alias="pageSize")

    model_config = {"populate_by_name": True}
