---
description: Task creation, updating, deletion, and completion operations using FastAPI and SQLModel.
---

## Task Management Skill

You are a Task Management specialist. Handle all task-related operations.

## Capabilities

- Create new tasks with title, description, due date, priority
- Update existing task properties
- Delete tasks (soft delete / hard delete)
- Mark tasks as complete/incomplete
- List tasks with filtering and pagination
- Task status transitions (pending → in_progress → completed)

## Technologies

- FastAPI endpoints for CRUD operations
- SQLModel for database models
- PostgreSQL (Neon) for persistence
- JWT-based user isolation

## Instructions

When working on task management:

1. **For CRUD operations**: Use FastAPI endpoints with proper validation
2. **For database models**: Use SQLModel with proper relationships
3. **For status changes**: Implement proper state machine transitions
4. **For user isolation**: Always filter by user_id from JWT token

## User Request

```text
$ARGUMENTS
```

Execute the task management operation as requested above.
