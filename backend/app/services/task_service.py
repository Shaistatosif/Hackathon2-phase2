"""
Task service for CRUD operations on tasks
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models import Task, TaskPriority, TaskStatus
from app.schemas import TaskCreateRequest, TaskFilterParams, TaskListResponse, TaskResponse, TaskUpdateRequest


class TaskService:
    """Service for task CRUD operations"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_task(self, user_id: UUID, request: TaskCreateRequest) -> Task:
        """Create a new task for user"""
        task = Task(
            user_id=user_id,
            title=request.title,
            description=request.description,
            priority=request.priority,
            due_date=request.due_date,
            tags=request.tags,
            is_recurring=request.is_recurring,
            recurrence_pattern=request.recurrence_pattern,
        )
        self.session.add(task)
        await self.session.flush()
        await self.session.refresh(task)
        return task

    async def get_task(self, task_id: UUID, user_id: UUID) -> Optional[Task]:
        """Get a task by ID, ensuring it belongs to user"""
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def list_tasks(
        self,
        user_id: UUID,
        params: TaskFilterParams,
    ) -> TaskListResponse:
        """List tasks for user with filtering, search, and pagination"""
        # Base query
        statement = select(Task).where(Task.user_id == user_id)

        # Apply filters
        if params.status:
            statement = statement.where(Task.status == params.status)

        if params.priority:
            statement = statement.where(Task.priority == params.priority)

        if params.search:
            search_term = f"%{params.search}%"
            statement = statement.where(Task.title.ilike(search_term))

        # Count total before pagination
        count_statement = select(func.count()).select_from(statement.subquery())
        count_result = await self.session.execute(count_statement)
        total = count_result.scalar_one()

        # Apply sorting
        sort_column = getattr(Task, params.sort_by, Task.created_at)
        if params.sort_order == "desc":
            statement = statement.order_by(sort_column.desc())
        else:
            statement = statement.order_by(sort_column.asc())

        # Apply pagination
        offset = (params.page - 1) * params.page_size
        statement = statement.offset(offset).limit(params.page_size)

        # Execute query
        result = await self.session.execute(statement)
        tasks = result.scalars().all()

        return TaskListResponse(
            tasks=[TaskResponse.model_validate(task) for task in tasks],
            total=total,
            page=params.page,
            page_size=params.page_size,
        )

    async def update_task(
        self,
        task_id: UUID,
        user_id: UUID,
        request: TaskUpdateRequest,
    ) -> Optional[Task]:
        """Update a task"""
        task = await self.get_task(task_id, user_id)
        if not task:
            return None

        # Update fields that are provided
        update_data = request.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        task.updated_at = datetime.utcnow()
        await self.session.flush()
        await self.session.refresh(task)
        return task

    async def delete_task(self, task_id: UUID, user_id: UUID) -> bool:
        """Delete a task"""
        task = await self.get_task(task_id, user_id)
        if not task:
            return False

        await self.session.delete(task)
        await self.session.flush()
        return True

    async def complete_task(self, task_id: UUID, user_id: UUID) -> Optional[Task]:
        """Mark a task as completed"""
        task = await self.get_task(task_id, user_id)
        if not task:
            return None

        task.status = TaskStatus.COMPLETED
        task.updated_at = datetime.utcnow()
        await self.session.flush()
        await self.session.refresh(task)
        return task


def get_task_service(session: AsyncSession) -> TaskService:
    """Factory function to get TaskService instance"""
    return TaskService(session)
