# Claude Code Rules

This file defines the project context, requirements, and development guidelines for the AI-powered Todo Web App.

---

## Project Overview

**Project Name:** AI-Powered Todo Web App
**Type:** Full-Stack Web Application with AI Chatbot
**Deployment:** Local (Minikube) + Cloud (Azure AKS / GKE / Oracle OKE)

---

## 1. Core Objective

Develop a **Full-Stack Todo Web App** with AI-powered chatbot integration, capable of local and cloud deployment, scalable and event-driven architecture.

---

## 2. Features / Functional Requirements

### 2.1 Todo Management
- CRUD tasks (Create, Read, Update, Delete)
- Mark tasks as completed
- Recurring tasks
- Task priorities, tags, due dates
- Filter, search, and sort tasks
- Task reminders and notifications

### 2.2 AI Chatbot
- Natural language understanding for task management
- Commands like "Add task", "Show pending tasks", "Complete task"
- Confirmation and error-handling messages
- Persistent conversation memory
- Hinglish (Hindi-English) language support

### 2.3 User Management
- Signup, Signin, Authentication
- JWT token-based security
- User isolation: each user sees only their tasks

### 2.4 Advanced Architecture
- Microservices-ready, stateless backend
- Event-driven with Kafka topics (task events, reminders, updates)
- Dapr integration for pub/sub, state management, service invocation, scheduled jobs, secrets

---

## 3. Technical Requirements

### 3.1 Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14+ | App Router, SSR/SSG |
| React 18+ | UI Components |
| Tailwind CSS | Styling |
| TypeScript | Type Safety |
| Shadcn/UI | Component Library |
| ChatKit | AI Chatbot UI |
| Better Auth | Authentication |

### 3.2 Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | REST API Framework |
| SQLModel | ORM (SQLAlchemy-based) |
| Pydantic | Data Validation |
| asyncpg | Async PostgreSQL Driver |
| Alembic | Database Migrations |

### 3.3 Database
| Technology | Purpose |
|------------|---------|
| Neon PostgreSQL | Serverless Database |
| Tables | users, tasks, conversations, messages |

### 3.4 Authentication
| Technology | Purpose |
|------------|---------|
| Better Auth | Auth Framework |
| JWT Tokens | Stateless Authentication |
| bcrypt | Password Hashing |

### 3.5 AI / Agent Stack
| Technology | Purpose |
|------------|---------|
| OpenAI GPT | Language Model |
| OpenAI Agents SDK | Agent Orchestration |
| MCP Tools | AI Tool Execution |
| LangChain (optional) | Chain Management |

### 3.6 Event-Driven Architecture
| Technology | Purpose |
|------------|---------|
| Apache Kafka | Event Streaming |
| Dapr Pub/Sub | Message Broker |
| WebSocket | Real-time Updates |

### 3.7 Infrastructure & DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Kubernetes | Orchestration |
| Minikube | Local K8s |
| Helm | Package Manager |
| Dapr | Sidecar Runtime |
| GitHub Actions | CI/CD Pipeline |

### 3.8 Cloud Deployment
| Platform | Service |
|----------|---------|
| Azure | AKS (Azure Kubernetes Service) |
| GCP | GKE (Google Kubernetes Engine) |
| Oracle | OKE (Oracle Kubernetes Engine) |

---

## 4. AI Agent Architecture

### 4.1 Main Agent
**todo-master-coordinator** - Central orchestration layer
- Cross-component coordination
- Conflict resolution between subagents
- Progress tracking
- Task assignments to subagents

### 4.2 Subagents (4)

| Agent | Responsibility |
|-------|----------------|
| **api-database-agent** | FastAPI, SQLModel, JWT, CRUD operations |
| **ui-ux-frontend-specialist** | Next.js, Tailwind, ChatKit, Better Auth |
| **conversational-agent** | NLU, intent detection, chat responses, Hinglish |
| **cloud-deployment-agent** | Docker, K8s, Helm, Kafka, Dapr, CI/CD |

### 4.3 Skills (10)

| Skill | Description |
|-------|-------------|
| `task-management` | Task CRUD, status transitions |
| `user-authentication` | Better Auth, JWT, sessions |
| `api-development` | REST APIs, MCP tools |
| `frontend-development` | Next.js, Tailwind, UI/UX |
| `backend-development` | FastAPI, SQLModel, PostgreSQL |
| `ai-agent-logic` | OpenAI Agents SDK, AI tasks |
| `chatbot-interaction` | NLU, chat responses |
| `event-driven-architecture` | Kafka, Pub/Sub, real-time |
| `deployment-infrastructure` | Docker, K8s, Helm, Cloud |
| `state-secret-management` | Dapr, secrets, scheduling |

---

## 5. API Endpoints

### 5.1 Authentication
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout
POST /api/auth/refresh      - Refresh JWT token
```

### 5.2 Tasks
```
GET    /api/tasks           - List user tasks (with filters)
POST   /api/tasks           - Create new task
GET    /api/tasks/{id}      - Get task details
PUT    /api/tasks/{id}      - Update task
DELETE /api/tasks/{id}      - Delete task
POST   /api/tasks/{id}/complete - Mark task complete
```

### 5.3 Chatbot
```
POST /api/chat/message      - Process chatbot message
GET  /api/chat/history      - Get conversation history
DELETE /api/chat/history    - Clear conversation
```

### 5.4 MCP Tools (AI Agent Actions)
```
add_task        - Create task via AI
list_tasks      - List tasks via AI
complete_task   - Complete task via AI
delete_task     - Delete task via AI
update_task     - Update task via AI
```

---

## 6. Database Schema

### 6.1 Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6.2 Tasks Table
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',  -- pending, in_progress, completed
    priority VARCHAR(10) DEFAULT 'medium', -- low, medium, high
    due_date TIMESTAMP,
    tags TEXT[],
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6.3 Conversations Table
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6.4 Messages Table
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    sender_type VARCHAR(10) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 7. Non-Functional Requirements

### 7.1 Performance
- API response time: < 200ms (p95)
- Chatbot response time: < 2s
- Support 1000+ concurrent users

### 7.2 Scalability
- Stateless backend for horizontal scaling
- Event-driven architecture for async processing
- Microservices-ready design

### 7.3 Reliability
- 99.9% uptime SLO
- Graceful degradation for AI services
- Retry mechanisms for external APIs

### 7.4 Security
- JWT token verification on all protected routes
- Password hashing with bcrypt
- HTTPS/TLS for all communications
- Secret management via Dapr/K8s Secrets
- User data isolation

### 7.5 Observability
- Structured logging (JSON format)
- Metrics collection (Prometheus)
- Distributed tracing
- Health check endpoints

---

## 8. Project Structure

```
/
├── frontend/                    # Next.js Application
│   ├── app/                     # App Router pages
│   │   ├── (auth)/              # Auth pages (login, register)
│   │   ├── dashboard/           # Dashboard page
│   │   ├── chat/                # Chatbot page
│   │   └── layout.tsx           # Root layout
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn/UI components
│   │   ├── chat/                # Chat components
│   │   └── tasks/               # Task components
│   ├── lib/                     # Utilities
│   └── styles/                  # Global styles
│
├── backend/                     # FastAPI Application
│   ├── app/
│   │   ├── api/                 # API endpoints
│   │   │   ├── auth.py          # Auth endpoints
│   │   │   ├── tasks.py         # Task endpoints
│   │   │   └── chat.py          # Chat endpoints
│   │   ├── models/              # SQLModel models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   ├── agents/              # AI agents
│   │   ├── mcp/                 # MCP tools
│   │   └── core/                # Config, security
│   ├── alembic/                 # Migrations
│   └── main.py                  # FastAPI app
│
├── infrastructure/              # DevOps Configuration
│   ├── docker/
│   │   ├── frontend.Dockerfile
│   │   └── backend.Dockerfile
│   ├── k8s/                     # Kubernetes manifests
│   │   ├── frontend/
│   │   ├── backend/
│   │   ├── kafka/
│   │   └── dapr/
│   ├── helm/                    # Helm charts
│   └── docker-compose.yml       # Local development
│
├── .github/
│   └── workflows/               # CI/CD pipelines
│       ├── ci.yml
│       └── deploy.yml
│
├── specs/                       # Feature specifications
│   └── todo-app/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
│
├── history/                     # Development history
│   ├── prompts/                 # PHRs
│   └── adr/                     # ADRs
│
├── .claude/                     # Claude Code config
│   ├── agents/                  # Agent definitions
│   ├── commands/                # CLI commands
│   └── skills/                  # Skill definitions
│
├── .specify/                    # SDD Framework
│   ├── memory/
│   │   └── constitution.md
│   ├── templates/
│   └── scripts/
│
├── .env.example                 # Environment template
├── CLAUDE.md                    # This file
└── README.md                    # Project documentation
```

---

## 9. Development Guidelines

### 9.1 Spec-Driven Development (SDD)
You are an expert AI assistant specializing in Spec-Driven Development. Follow this workflow:

```
SPECIFY → PLAN → TASKS → IMPLEMENT → TEST
```

### 9.2 Commands Available
| Command | Purpose |
|---------|---------|
| `/sp.specify` | Create feature specification |
| `/sp.plan` | Create architecture plan |
| `/sp.tasks` | Generate implementation tasks |
| `/sp.implement` | Execute tasks |
| `/sp.adr` | Document architectural decisions |
| `/sp.phr` | Record prompt history |

### 9.3 Code Standards
- Use TypeScript for frontend
- Use Python type hints for backend
- Follow REST API conventions
- Write unit tests for critical paths
- Use meaningful commit messages

### 9.4 Git Workflow
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

---

## 10. Core Guarantees (Product Promise)

- Record every user input verbatim in a Prompt History Record (PHR)
- PHR routing under `history/prompts/`:
  - Constitution → `history/prompts/constitution/`
  - Feature-specific → `history/prompts/<feature-name>/`
  - General → `history/prompts/general/`
- ADR suggestions for significant architectural decisions
- Never auto-create ADRs; require user consent

---

## 11. Human as Tool Strategy

You MUST invoke the user for input when encountering:

1. **Ambiguous Requirements:** Ask 2-3 targeted clarifying questions
2. **Unforeseen Dependencies:** Surface and ask for prioritization
3. **Architectural Uncertainty:** Present options and get preference
4. **Completion Checkpoint:** Summarize and confirm next steps

---

## 12. Default Policies

- Clarify and plan first before implementing
- Do not invent APIs or data contracts; ask if missing
- Never hardcode secrets; use `.env` files
- Prefer smallest viable diff; no unrelated refactoring
- Cite existing code with file references
- Keep reasoning private; output only decisions and artifacts

---

## 13. Minimum Acceptance Criteria

- [ ] Clear, testable acceptance criteria included
- [ ] Explicit error paths and constraints stated
- [ ] Smallest viable change; no unrelated edits
- [ ] Code references to modified/inspected files
- [ ] PHR created for each significant interaction
- [ ] ADR suggested for architectural decisions

---

## Quick Reference

| What | Where |
|------|-------|
| Project Principles | `.specify/memory/constitution.md` |
| Feature Specs | `specs/<feature>/spec.md` |
| Architecture Plans | `specs/<feature>/plan.md` |
| Implementation Tasks | `specs/<feature>/tasks.md` |
| Prompt History | `history/prompts/` |
| Decision Records | `history/adr/` |
| Agents | `.claude/agents/` |
| Skills | `.claude/skills/` |
| Commands | `.claude/commands/` |

## Active Technologies
- Neon PostgreSQL (serverless) (001-todo-app)

## Recent Changes
- 001-todo-app: Added Neon PostgreSQL (serverless)
