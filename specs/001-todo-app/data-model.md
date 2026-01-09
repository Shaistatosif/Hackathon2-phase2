# Data Model: AI-Powered Todo Application

**Feature Branch**: `001-todo-app`
**Date**: 2026-01-08
**Status**: Complete

## Entity Overview

```
┌─────────────┐       ┌─────────────┐
│    User     │───1:N─│    Task     │
└─────────────┘       └─────────────┘
       │
       │1:N
       ▼
┌─────────────┐       ┌─────────────┐
│ Conversation│───1:N─│   Message   │
└─────────────┘       └─────────────┘
```

## Entities

### User

Represents a registered user of the application.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address (login identifier) |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| name | VARCHAR(100) | NOT NULL | User's display name |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW(), ON UPDATE | Last profile update timestamp |

**Validation Rules**:
- email: Valid email format, unique across all users
- password: Minimum 8 characters, at least one uppercase, one lowercase, one number
- name: 1-100 characters, non-empty

**Indexes**:
- PRIMARY KEY on id
- UNIQUE INDEX on email

### Task

Represents a to-do item belonging to a user.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| user_id | UUID | FK → users.id, NOT NULL | Owner of the task |
| title | VARCHAR(255) | NOT NULL | Task title |
| description | TEXT | NULL | Optional detailed description |
| status | VARCHAR(20) | DEFAULT 'pending' | Current status: pending, in_progress, completed |
| priority | VARCHAR(10) | DEFAULT 'medium' | Priority level: low, medium, high |
| due_date | TIMESTAMP | NULL | Optional deadline |
| tags | TEXT[] | DEFAULT '{}' | Array of tag strings |
| is_recurring | BOOLEAN | DEFAULT FALSE | Whether task repeats |
| recurrence_pattern | VARCHAR(50) | NULL | Pattern: daily, weekly, monthly |
| created_at | TIMESTAMP | DEFAULT NOW() | Task creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW(), ON UPDATE | Last modification timestamp |

**Validation Rules**:
- title: 1-255 characters, non-empty, trimmed
- status: Must be one of: pending, in_progress, completed
- priority: Must be one of: low, medium, high
- recurrence_pattern: If is_recurring=true, must be one of: daily, weekly, monthly
- due_date: Must be in the future when creating (can be past for existing tasks)

**State Transitions**:
```
pending ──► in_progress ──► completed
   │             │              │
   └─────────────┴──────────────┘
         (can revert to pending)
```

**Indexes**:
- PRIMARY KEY on id
- INDEX on user_id (FK lookup)
- INDEX on (user_id, status) (filter queries)
- INDEX on (user_id, due_date) (sorting by deadline)
- INDEX on (user_id, priority) (filter by priority)

### Conversation

Represents a chat session between a user and the AI chatbot.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| user_id | UUID | FK → users.id, NOT NULL | User who owns the conversation |
| created_at | TIMESTAMP | DEFAULT NOW() | Session start timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW(), ON UPDATE | Last message timestamp |

**Validation Rules**:
- Each user can have multiple conversations (history)
- Conversations are created when user sends first message in a session

**Indexes**:
- PRIMARY KEY on id
- INDEX on user_id (FK lookup)
- INDEX on (user_id, created_at DESC) (recent conversations)

### Message

Represents individual messages within a conversation.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| conversation_id | UUID | FK → conversations.id, NOT NULL | Parent conversation |
| sender_type | VARCHAR(10) | NOT NULL | 'user' or 'assistant' |
| content | TEXT | NOT NULL | Message text content |
| created_at | TIMESTAMP | DEFAULT NOW() | Message timestamp |

**Validation Rules**:
- sender_type: Must be one of: user, assistant
- content: Non-empty string

**Indexes**:
- PRIMARY KEY on id
- INDEX on conversation_id (FK lookup)
- INDEX on (conversation_id, created_at) (message ordering)

## Relationships

| Relationship | Type | On Delete |
|--------------|------|-----------|
| User → Task | 1:N | CASCADE (delete user deletes all tasks) |
| User → Conversation | 1:N | CASCADE (delete user deletes conversations) |
| Conversation → Message | 1:N | CASCADE (delete conversation deletes messages) |

## SQLModel Definitions (Python)

```python
# backend/app/models/user.py
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True)
    password_hash: str = Field(max_length=255)
    name: str = Field(max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# backend/app/models/task.py
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, List
from enum import Enum

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class RecurrencePattern(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=255)
    description: Optional[str] = None
    status: TaskStatus = Field(default=TaskStatus.PENDING)
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)
    due_date: Optional[datetime] = None
    tags: List[str] = Field(default_factory=list, sa_column_kwargs={"type_": "TEXT[]"})
    is_recurring: bool = Field(default=False)
    recurrence_pattern: Optional[RecurrencePattern] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# backend/app/models/conversation.py
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# backend/app/models/message.py
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum

class SenderType(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversations.id", index=True)
    sender_type: SenderType
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

## TypeScript Types (Frontend)

```typescript
// frontend/types/index.ts

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly';
export type SenderType = 'user' | 'assistant';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  tags: string[];
  isRecurring: boolean;
  recurrencePattern: RecurrencePattern | null;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: SenderType;
  content: string;
  createdAt: string;
}

// API Response types
export interface TaskCreateRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
}

export interface ChatMessageRequest {
  message: string;
  conversationId?: string;
}

export interface ChatMessageResponse {
  message: Message;
  response: Message;
  taskAction?: {
    action: 'created' | 'updated' | 'completed' | 'deleted' | 'listed';
    task?: Task;
    tasks?: Task[];
  };
}
```

## Migration Strategy

1. **Initial Migration**: Create all tables with constraints
2. **Seed Data**: Admin user for testing (optional)
3. **Index Creation**: Add performance indexes after table creation

Alembic migration file naming: `{revision}_create_{entity}_table.py`

## Data Retention

- User data: Retained until account deletion
- Tasks: Retained until explicit deletion by user
- Conversations: Retained for 90 days (configurable)
- Messages: Retained with parent conversation
