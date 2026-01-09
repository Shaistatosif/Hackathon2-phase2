"""
MCP Tool: List Tasks
Lists tasks for the user with optional filtering
"""
from typing import Optional

from pydantic import BaseModel, Field


class ListTasksInput(BaseModel):
    """Input schema for list_tasks tool"""

    status: Optional[str] = Field(
        None,
        description="Filter by status: 'pending', 'in_progress', or 'completed'"
    )
    priority: Optional[str] = Field(
        None,
        description="Filter by priority: 'low', 'medium', or 'high'"
    )
    search: Optional[str] = Field(
        None,
        description="Search keyword to filter tasks by title"
    )
    limit: Optional[int] = Field(
        10,
        description="Maximum number of tasks to return (default: 10)"
    )


class TaskSummary(BaseModel):
    """Summary of a task for display"""

    id: str
    title: str
    status: str
    priority: str
    due_date: Optional[str] = None
    tags: list[str] = []


class ListTasksOutput(BaseModel):
    """Output schema for list_tasks tool"""

    success: bool
    tasks: list[TaskSummary] = []
    total_count: int = 0
    message: str


LIST_TASKS_TOOL_DEFINITION = {
    "name": "list_tasks",
    "description": "List and filter the user's tasks. Use this when the user wants to see, view, show, or find their tasks/todos.",
    "parameters": ListTasksInput.model_json_schema(),
}
