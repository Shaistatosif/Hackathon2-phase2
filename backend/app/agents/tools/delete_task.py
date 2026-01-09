"""
MCP Tool: Delete Task
Deletes a task permanently
"""
from typing import Optional

from pydantic import BaseModel, Field


class DeleteTaskInput(BaseModel):
    """Input schema for delete_task tool"""

    task_id: Optional[str] = Field(
        None,
        description="The ID of the task to delete"
    )
    title: Optional[str] = Field(
        None,
        description="The title of the task to delete (used for searching if ID not provided)"
    )
    confirm: bool = Field(
        True,
        description="Confirmation flag for deletion (should be True)"
    )


class DeleteTaskOutput(BaseModel):
    """Output schema for delete_task tool"""

    success: bool
    task_id: Optional[str] = None
    title: Optional[str] = None
    message: str


DELETE_TASK_TOOL_DEFINITION = {
    "name": "delete_task",
    "description": "Delete a task permanently. Use this when the user wants to delete, remove, or discard a task/todo.",
    "parameters": DeleteTaskInput.model_json_schema(),
}
