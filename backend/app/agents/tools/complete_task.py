"""
MCP Tool: Complete Task
Marks a task as completed
"""
from typing import Optional

from pydantic import BaseModel, Field


class CompleteTaskInput(BaseModel):
    """Input schema for complete_task tool"""

    task_id: Optional[str] = Field(
        None,
        description="The ID of the task to complete"
    )
    title: Optional[str] = Field(
        None,
        description="The title of the task to complete (used for searching if ID not provided)"
    )


class CompleteTaskOutput(BaseModel):
    """Output schema for complete_task tool"""

    success: bool
    task_id: Optional[str] = None
    title: Optional[str] = None
    message: str


COMPLETE_TASK_TOOL_DEFINITION = {
    "name": "complete_task",
    "description": "Mark a task as completed. Use this when the user wants to complete, finish, or mark done a task/todo.",
    "parameters": CompleteTaskInput.model_json_schema(),
}
