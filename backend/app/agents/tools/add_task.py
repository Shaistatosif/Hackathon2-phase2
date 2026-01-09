"""
MCP Tool: Add Task
Creates a new task for the user via natural language
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models import TaskPriority, RecurrencePattern


class AddTaskInput(BaseModel):
    """Input schema for add_task tool"""

    title: str = Field(..., description="The title of the task")
    description: Optional[str] = Field(None, description="Optional description of the task")
    priority: Optional[str] = Field(
        "medium",
        description="Priority level: 'low', 'medium', or 'high'"
    )
    due_date: Optional[str] = Field(
        None,
        description="Due date in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)"
    )
    tags: Optional[list[str]] = Field(
        None,
        description="Optional list of tags for the task"
    )
    is_recurring: Optional[bool] = Field(
        False,
        description="Whether the task is recurring"
    )
    recurrence_pattern: Optional[str] = Field(
        None,
        description="Recurrence pattern: 'daily', 'weekly', or 'monthly'"
    )


class AddTaskOutput(BaseModel):
    """Output schema for add_task tool"""

    success: bool
    task_id: Optional[str] = None
    title: Optional[str] = None
    message: str


def parse_priority(priority_str: Optional[str]) -> TaskPriority:
    """Parse priority string to TaskPriority enum"""
    if not priority_str:
        return TaskPriority.MEDIUM

    priority_map = {
        "low": TaskPriority.LOW,
        "medium": TaskPriority.MEDIUM,
        "high": TaskPriority.HIGH,
    }
    return priority_map.get(priority_str.lower(), TaskPriority.MEDIUM)


def parse_recurrence(pattern_str: Optional[str]) -> Optional[RecurrencePattern]:
    """Parse recurrence pattern string to RecurrencePattern enum"""
    if not pattern_str:
        return None

    pattern_map = {
        "daily": RecurrencePattern.DAILY,
        "weekly": RecurrencePattern.WEEKLY,
        "monthly": RecurrencePattern.MONTHLY,
    }
    return pattern_map.get(pattern_str.lower())


def parse_due_date(date_str: Optional[str]) -> Optional[datetime]:
    """Parse due date string to datetime"""
    if not date_str:
        return None

    try:
        # Try ISO format with time
        return datetime.fromisoformat(date_str)
    except ValueError:
        try:
            # Try date only format
            return datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return None


ADD_TASK_TOOL_DEFINITION = {
    "name": "add_task",
    "description": "Create a new task for the user. Use this when the user wants to add, create, or make a new task/todo item.",
    "parameters": AddTaskInput.model_json_schema(),
}
