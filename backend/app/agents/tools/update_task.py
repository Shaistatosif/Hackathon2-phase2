"""
MCP Tool: Update Task
Updates an existing task's properties
"""
from typing import Optional

from pydantic import BaseModel, Field


class UpdateTaskInput(BaseModel):
    """Input schema for update_task tool"""

    task_id: Optional[str] = Field(
        None,
        description="The ID of the task to update"
    )
    title_search: Optional[str] = Field(
        None,
        description="The title to search for if task_id is not provided"
    )
    new_title: Optional[str] = Field(
        None,
        description="New title for the task"
    )
    new_description: Optional[str] = Field(
        None,
        description="New description for the task"
    )
    new_priority: Optional[str] = Field(
        None,
        description="New priority: 'low', 'medium', or 'high'"
    )
    new_status: Optional[str] = Field(
        None,
        description="New status: 'pending', 'in_progress', or 'completed'"
    )
    new_due_date: Optional[str] = Field(
        None,
        description="New due date in ISO format (YYYY-MM-DD)"
    )
    new_tags: Optional[list[str]] = Field(
        None,
        description="New list of tags for the task"
    )


class UpdateTaskOutput(BaseModel):
    """Output schema for update_task tool"""

    success: bool
    task_id: Optional[str] = None
    title: Optional[str] = None
    changes: list[str] = []
    message: str


UPDATE_TASK_TOOL_DEFINITION = {
    "name": "update_task",
    "description": "Update an existing task's properties. Use this when the user wants to modify, change, edit, or update a task/todo.",
    "parameters": UpdateTaskInput.model_json_schema(),
}
