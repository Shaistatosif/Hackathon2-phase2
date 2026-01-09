"""
Task API endpoints for CRUD operations
"""
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import CurrentUser, DbSession
from app.models import TaskPriority, TaskStatus
from app.schemas import (
    TaskCreateRequest,
    TaskFilterParams,
    TaskListResponse,
    TaskResponse,
    TaskUpdateRequest,
)
from app.services.task_service import get_task_service

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get(
    "",
    response_model=TaskListResponse,
    response_model_by_alias=True,
    summary="List tasks",
    description="Get paginated list of tasks with optional filtering.",
)
async def list_tasks(
    session: DbSession,
    current_user: CurrentUser,
    status: TaskStatus | None = Query(None, description="Filter by status"),
    priority: TaskPriority | None = Query(None, description="Filter by priority"),
    search: str | None = Query(None, description="Search in title"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
) -> TaskListResponse:
    """
    List all tasks for the current user.

    - **status**: Filter by task status (pending, in_progress, completed)
    - **priority**: Filter by priority (low, medium, high)
    - **search**: Search in task title
    - **sort_by**: Field to sort by (created_at, due_date, priority, title)
    - **sort_order**: Sort direction (asc, desc)
    - **page**: Page number (starts at 1)
    - **page_size**: Number of items per page (max 100)
    """
    task_service = get_task_service(session)
    params = TaskFilterParams(
        status=status,
        priority=priority,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
    )
    return await task_service.list_tasks(current_user.id, params)


@router.post(
    "",
    response_model=TaskResponse,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
    summary="Create task",
    description="Create a new task.",
)
async def create_task(
    request: TaskCreateRequest,
    session: DbSession,
    current_user: CurrentUser,
) -> TaskResponse:
    """
    Create a new task.

    - **title**: Task title (required, 1-255 characters)
    - **description**: Optional description
    - **priority**: Priority level (low, medium, high)
    - **due_date**: Optional due date
    - **tags**: Optional list of tags
    - **is_recurring**: Whether task repeats
    - **recurrence_pattern**: Pattern for recurring tasks (daily, weekly, monthly)
    """
    task_service = get_task_service(session)
    task = await task_service.create_task(current_user.id, request)
    return TaskResponse.model_validate(task)


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    response_model_by_alias=True,
    summary="Get task",
    description="Get task details by ID.",
)
async def get_task(
    task_id: UUID,
    session: DbSession,
    current_user: CurrentUser,
) -> TaskResponse:
    """Get a specific task by ID."""
    task_service = get_task_service(session)
    task = await task_service.get_task(task_id, current_user.id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return TaskResponse.model_validate(task)


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    response_model_by_alias=True,
    summary="Update task",
    description="Update an existing task.",
)
async def update_task(
    task_id: UUID,
    request: TaskUpdateRequest,
    session: DbSession,
    current_user: CurrentUser,
) -> TaskResponse:
    """
    Update a task.

    All fields are optional - only provided fields will be updated.
    """
    task_service = get_task_service(session)
    task = await task_service.update_task(task_id, current_user.id, request)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return TaskResponse.model_validate(task)


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete task",
    description="Delete a task by ID.",
)
async def delete_task(
    task_id: UUID,
    session: DbSession,
    current_user: CurrentUser,
) -> None:
    """Delete a task."""
    task_service = get_task_service(session)
    deleted = await task_service.delete_task(task_id, current_user.id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )


@router.post(
    "/{task_id}/complete",
    response_model=TaskResponse,
    response_model_by_alias=True,
    summary="Complete task",
    description="Mark a task as completed.",
)
async def complete_task(
    task_id: UUID,
    session: DbSession,
    current_user: CurrentUser,
) -> TaskResponse:
    """Mark a task as completed."""
    task_service = get_task_service(session)
    task = await task_service.complete_task(task_id, current_user.id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return TaskResponse.model_validate(task)
