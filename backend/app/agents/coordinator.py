"""
AI Coordinator using OpenAI Agents SDK
Orchestrates task management through natural language
"""
import json
from datetime import datetime
from typing import Optional
from uuid import UUID

from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.config import get_settings
from app.models import Task, TaskStatus, TaskPriority
from app.schemas import TaskCreateRequest, TaskFilterParams, TaskUpdateRequest
from app.services.task_service import TaskService

from .prompts import SYSTEM_PROMPT, get_response_message
from .tools import (
    AddTaskInput,
    ListTasksInput,
    CompleteTaskInput,
    UpdateTaskInput,
    DeleteTaskInput,
    ADD_TASK_TOOL_DEFINITION,
    LIST_TASKS_TOOL_DEFINITION,
    COMPLETE_TASK_TOOL_DEFINITION,
    UPDATE_TASK_TOOL_DEFINITION,
    DELETE_TASK_TOOL_DEFINITION,
    parse_priority,
    parse_recurrence,
    parse_due_date,
)


class AICoordinator:
    """AI Coordinator for task management via natural language"""

    def __init__(self, session: AsyncSession, user_id: UUID):
        self.session = session
        self.user_id = user_id
        self.settings = get_settings()
        self.client = AsyncOpenAI(api_key=self.settings.OPENAI_API_KEY)
        self.task_service = TaskService(session)

        # Define available tools
        self.tools = [
            {"type": "function", "function": ADD_TASK_TOOL_DEFINITION},
            {"type": "function", "function": LIST_TASKS_TOOL_DEFINITION},
            {"type": "function", "function": COMPLETE_TASK_TOOL_DEFINITION},
            {"type": "function", "function": UPDATE_TASK_TOOL_DEFINITION},
            {"type": "function", "function": DELETE_TASK_TOOL_DEFINITION},
        ]

    async def process_message(
        self,
        user_message: str,
        conversation_history: Optional[list[dict]] = None,
    ) -> tuple[str, Optional[dict]]:
        """
        Process a user message and return AI response with optional task action

        Returns:
            tuple: (response_text, task_action_dict or None)
        """
        # Build messages for OpenAI
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Add conversation history
        if conversation_history:
            messages.extend(conversation_history)

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        # Call OpenAI with tools
        response = await self.client.chat.completions.create(
            model=self.settings.OPENAI_MODEL,
            messages=messages,
            tools=self.tools,
            tool_choice="auto",
        )

        assistant_message = response.choices[0].message
        task_action = None

        # Check if tool was called
        if assistant_message.tool_calls:
            # Add assistant message with tool calls to history
            messages.append(assistant_message.model_dump())

            # Process ALL tool calls (OpenAI may return multiple)
            for tool_call in assistant_message.tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)

                # Execute the tool
                tool_result, action = await self._execute_tool(
                    function_name, function_args
                )

                # Keep the last task_action (most relevant)
                if action:
                    task_action = action

                # Add tool response for this tool_call_id
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(tool_result),
                })

            # Get final response from AI with all tool results
            final_response = await self.client.chat.completions.create(
                model=self.settings.OPENAI_MODEL,
                messages=messages,
            )
            response_text = final_response.choices[0].message.content
        else:
            response_text = assistant_message.content

        return response_text or "", task_action

    async def _execute_tool(
        self, function_name: str, args: dict
    ) -> tuple[dict, Optional[dict]]:
        """Execute a tool and return the result"""

        if function_name == "add_task":
            return await self._handle_add_task(args)
        elif function_name == "list_tasks":
            return await self._handle_list_tasks(args)
        elif function_name == "complete_task":
            return await self._handle_complete_task(args)
        elif function_name == "update_task":
            return await self._handle_update_task(args)
        elif function_name == "delete_task":
            return await self._handle_delete_task(args)
        else:
            return {"success": False, "message": f"Unknown tool: {function_name}"}, None

    async def _handle_add_task(self, args: dict) -> tuple[dict, Optional[dict]]:
        """Handle add_task tool execution"""
        try:
            input_data = AddTaskInput(**args)

            # Create task request
            task_request = TaskCreateRequest(
                title=input_data.title,
                description=input_data.description,
                priority=parse_priority(input_data.priority),
                due_date=parse_due_date(input_data.due_date),
                tags=input_data.tags or [],
                is_recurring=input_data.is_recurring or False,
                recurrence_pattern=parse_recurrence(input_data.recurrence_pattern),
            )

            task = await self.task_service.create_task(self.user_id, task_request)

            result = {
                "success": True,
                "task_id": str(task.id),
                "title": task.title,
                "message": f"Task '{task.title}' created successfully!",
            }

            task_action = {
                "action": "created",
                "task": {
                    "id": str(task.id),
                    "title": task.title,
                    "status": task.status.value,
                    "priority": task.priority.value,
                },
            }

            return result, task_action

        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to create task: {str(e)}",
            }, None

    async def _handle_list_tasks(self, args: dict) -> tuple[dict, Optional[dict]]:
        """Handle list_tasks tool execution"""
        try:
            input_data = ListTasksInput(**args)

            # Build filter params
            status = None
            if input_data.status:
                status = TaskStatus(input_data.status)

            priority = None
            if input_data.priority:
                priority = TaskPriority(input_data.priority)

            params = TaskFilterParams(
                status=status,
                priority=priority,
                search=input_data.search,
                page_size=input_data.limit or 10,
            )

            task_list = await self.task_service.list_tasks(self.user_id, params)

            tasks_summary = []
            for task in task_list.tasks:
                tasks_summary.append({
                    "id": str(task.id),
                    "title": task.title,
                    "status": task.status,
                    "priority": task.priority,
                    "due_date": task.due_date.isoformat() if task.due_date else None,
                    "tags": task.tags,
                })

            result = {
                "success": True,
                "tasks": tasks_summary,
                "total_count": task_list.total,
                "message": f"Found {task_list.total} tasks.",
            }

            task_action = {
                "action": "listed",
                "tasks": tasks_summary,
            }

            return result, task_action

        except Exception as e:
            return {
                "success": False,
                "tasks": [],
                "total_count": 0,
                "message": f"Failed to list tasks: {str(e)}",
            }, None

    async def _handle_complete_task(self, args: dict) -> tuple[dict, Optional[dict]]:
        """Handle complete_task tool execution"""
        try:
            input_data = CompleteTaskInput(**args)

            task = None

            # Find task by ID or title
            if input_data.task_id:
                task = await self.task_service.get_task(
                    UUID(input_data.task_id), self.user_id
                )
            elif input_data.title:
                # Search for task by title
                task = await self._find_task_by_title(input_data.title)

            if not task:
                search_term = input_data.task_id or input_data.title
                return {
                    "success": False,
                    "message": f"Could not find task matching '{search_term}'.",
                }, None

            # Complete the task
            completed_task = await self.task_service.complete_task(task.id, self.user_id)

            result = {
                "success": True,
                "task_id": str(completed_task.id),
                "title": completed_task.title,
                "message": f"Task '{completed_task.title}' marked as completed!",
            }

            task_action = {
                "action": "completed",
                "task": {
                    "id": str(completed_task.id),
                    "title": completed_task.title,
                    "status": completed_task.status.value,
                },
            }

            return result, task_action

        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to complete task: {str(e)}",
            }, None

    async def _handle_update_task(self, args: dict) -> tuple[dict, Optional[dict]]:
        """Handle update_task tool execution"""
        try:
            input_data = UpdateTaskInput(**args)

            task = None

            # Find task by ID or title
            if input_data.task_id:
                task = await self.task_service.get_task(
                    UUID(input_data.task_id), self.user_id
                )
            elif input_data.title_search:
                task = await self._find_task_by_title(input_data.title_search)

            if not task:
                search_term = input_data.task_id or input_data.title_search
                return {
                    "success": False,
                    "message": f"Could not find task matching '{search_term}'.",
                }, None

            # Build update request
            update_data = {}
            changes = []

            if input_data.new_title:
                update_data["title"] = input_data.new_title
                changes.append(f"title to '{input_data.new_title}'")

            if input_data.new_description:
                update_data["description"] = input_data.new_description
                changes.append("description")

            if input_data.new_priority:
                update_data["priority"] = parse_priority(input_data.new_priority)
                changes.append(f"priority to '{input_data.new_priority}'")

            if input_data.new_status:
                update_data["status"] = TaskStatus(input_data.new_status)
                changes.append(f"status to '{input_data.new_status}'")

            if input_data.new_due_date:
                update_data["due_date"] = parse_due_date(input_data.new_due_date)
                changes.append("due date")

            if input_data.new_tags is not None:
                update_data["tags"] = input_data.new_tags
                changes.append("tags")

            if not update_data:
                return {
                    "success": False,
                    "message": "No changes specified for update.",
                }, None

            update_request = TaskUpdateRequest(**update_data)
            updated_task = await self.task_service.update_task(
                task.id, self.user_id, update_request
            )

            result = {
                "success": True,
                "task_id": str(updated_task.id),
                "title": updated_task.title,
                "changes": changes,
                "message": f"Task '{updated_task.title}' updated: {', '.join(changes)}",
            }

            task_action = {
                "action": "updated",
                "task": {
                    "id": str(updated_task.id),
                    "title": updated_task.title,
                    "status": updated_task.status.value,
                    "priority": updated_task.priority.value,
                },
                "changes": changes,
            }

            return result, task_action

        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to update task: {str(e)}",
            }, None

    async def _handle_delete_task(self, args: dict) -> tuple[dict, Optional[dict]]:
        """Handle delete_task tool execution"""
        try:
            input_data = DeleteTaskInput(**args)

            task = None

            # Find task by ID or title
            if input_data.task_id:
                task = await self.task_service.get_task(
                    UUID(input_data.task_id), self.user_id
                )
            elif input_data.title:
                task = await self._find_task_by_title(input_data.title)

            if not task:
                search_term = input_data.task_id or input_data.title
                return {
                    "success": False,
                    "message": f"Could not find task matching '{search_term}'.",
                }, None

            task_title = task.title
            task_id = str(task.id)

            # Delete the task
            deleted = await self.task_service.delete_task(task.id, self.user_id)

            if deleted:
                result = {
                    "success": True,
                    "task_id": task_id,
                    "title": task_title,
                    "message": f"Task '{task_title}' has been deleted.",
                }

                task_action = {
                    "action": "deleted",
                    "task": {
                        "id": task_id,
                        "title": task_title,
                    },
                }

                return result, task_action
            else:
                return {
                    "success": False,
                    "message": "Failed to delete task.",
                }, None

        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to delete task: {str(e)}",
            }, None

    async def _find_task_by_title(self, title: str) -> Optional[Task]:
        """Find a task by partial title match"""
        search_term = f"%{title}%"
        statement = select(Task).where(
            Task.user_id == self.user_id,
            Task.title.ilike(search_term),
        ).limit(1)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()


def get_ai_coordinator(session: AsyncSession, user_id: UUID) -> AICoordinator:
    """Factory function to get AICoordinator instance"""
    return AICoordinator(session, user_id)
