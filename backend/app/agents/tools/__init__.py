"""MCP Tools for AI Agent operations"""

from .add_task import (
    AddTaskInput,
    AddTaskOutput,
    ADD_TASK_TOOL_DEFINITION,
    parse_priority,
    parse_recurrence,
    parse_due_date,
)
from .list_tasks import (
    ListTasksInput,
    ListTasksOutput,
    TaskSummary,
    LIST_TASKS_TOOL_DEFINITION,
)
from .complete_task import (
    CompleteTaskInput,
    CompleteTaskOutput,
    COMPLETE_TASK_TOOL_DEFINITION,
)
from .update_task import (
    UpdateTaskInput,
    UpdateTaskOutput,
    UPDATE_TASK_TOOL_DEFINITION,
)
from .delete_task import (
    DeleteTaskInput,
    DeleteTaskOutput,
    DELETE_TASK_TOOL_DEFINITION,
)

__all__ = [
    # Add Task
    "AddTaskInput",
    "AddTaskOutput",
    "ADD_TASK_TOOL_DEFINITION",
    "parse_priority",
    "parse_recurrence",
    "parse_due_date",
    # List Tasks
    "ListTasksInput",
    "ListTasksOutput",
    "TaskSummary",
    "LIST_TASKS_TOOL_DEFINITION",
    # Complete Task
    "CompleteTaskInput",
    "CompleteTaskOutput",
    "COMPLETE_TASK_TOOL_DEFINITION",
    # Update Task
    "UpdateTaskInput",
    "UpdateTaskOutput",
    "UPDATE_TASK_TOOL_DEFINITION",
    # Delete Task
    "DeleteTaskInput",
    "DeleteTaskOutput",
    "DELETE_TASK_TOOL_DEFINITION",
]
