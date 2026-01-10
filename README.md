# AI-Powered Todo Web App

A Full-Stack Todo Web Application with AI-powered chatbot integration, capable of local and cloud deployment with scalable, event-driven architecture.

## Features

### Todo Management
- CRUD operations (Create, Read, Update, Delete)
- Mark tasks as completed
- Recurring tasks support
- Task priorities, tags, and due dates
- Filter, search, and sort tasks
- Task reminders and notifications

### AI Chatbot
- Natural language understanding for task management
- Commands: "Add task", "Show pending tasks", "Complete task"
- Persistent conversation memory
- Hinglish (Hindi-English) language support

### User Management
- Signup, Signin, Authentication
- JWT token-based security
- User isolation: each user sees only their tasks

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14+ | App Router, SSR/SSG |
| React 18+ | UI Components |
| Tailwind CSS | Styling |
| TypeScript | Type Safety |
| Shadcn/UI | Component Library |
| Better Auth | Authentication |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | REST API Framework |
| SQLModel | ORM (SQLAlchemy-based) |
| Pydantic | Data Validation |
| asyncpg | Async PostgreSQL Driver |
| Alembic | Database Migrations |

### Database
| Technology | Purpose |
|------------|---------|
| Neon PostgreSQL | Serverless Database |

### AI/Agent Stack
| Technology | Purpose |
|------------|---------|
| OpenAI GPT | Language Model |
| OpenAI Agents SDK | Agent Orchestration |
| MCP Tools | AI Tool Execution |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Kubernetes | Orchestration |
| Minikube | Local K8s |
| Helm | Package Manager |
| Apache Kafka | Event Streaming |
| Dapr | Sidecar Runtime |

## Project Structure

```
/
├── frontend/                    # Next.js Application
│   ├── app/                     # App Router pages
│   ├── components/              # React components
│   ├── lib/                     # Utilities
│   └── styles/                  # Global styles
│
├── backend/                     # FastAPI Application
│   ├── app/
│   │   ├── api/                 # API endpoints
│   │   ├── models/              # SQLModel models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   ├── agents/              # AI agents
│   │   └── mcp/                 # MCP tools
│   ├── alembic/                 # Migrations
│   └── main.py                  # FastAPI app
│
├── infrastructure/              # DevOps Configuration
│   ├── docker/                  # Dockerfiles
│   ├── k8s/                     # Kubernetes manifests
│   └── helm/                    # Helm charts
│
├── specs/                       # Feature specifications
├── history/                     # Development history (PHRs, ADRs)
├── .claude/                     # Claude Code config
│   ├── agents/                  # Agent definitions
│   ├── commands/                # CLI commands
│   └── Skills/                  # Skill definitions
└── .specify/                    # SDD Framework
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- Docker & Docker Compose
- PostgreSQL (or Neon account)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## API Endpoints

### Authentication
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout
POST /api/auth/refresh      - Refresh JWT token
```

### Tasks
```
GET    /api/tasks           - List user tasks
POST   /api/tasks           - Create new task
GET    /api/tasks/{id}      - Get task details
PUT    /api/tasks/{id}      - Update task
DELETE /api/tasks/{id}      - Delete task
POST   /api/tasks/{id}/complete - Mark task complete
```

### Chatbot
```
POST /api/chat/message      - Process chatbot message
GET  /api/chat/history      - Get conversation history
DELETE /api/chat/history    - Clear conversation
```

## AI Agent Architecture

### Main Agent
**todo-master-coordinator** - Central orchestration layer for cross-component coordination

### Subagents
| Agent | Responsibility |
|-------|----------------|
| api-database-agent | FastAPI, SQLModel, JWT, CRUD operations |
| ui-ux-frontend-specialist | Next.js, Tailwind, ChatKit, Better Auth |
| conversational-agent | NLU, intent detection, chat responses |
| cloud-deployment-agent | Docker, K8s, Helm, Kafka, Dapr, CI/CD |

## Cloud Deployment

Supports deployment on:
- **Azure** - AKS (Azure Kubernetes Service)
- **GCP** - GKE (Google Kubernetes Engine)
- **Oracle** - OKE (Oracle Kubernetes Engine)

## Development Guidelines

This project follows **Spec-Driven Development (SDD)**:

```
SPECIFY → PLAN → TASKS → IMPLEMENT → TEST
```

Available Commands:
- `/sp.specify` - Create feature specification
- `/sp.plan` - Create architecture plan
- `/sp.tasks` - Generate implementation tasks
- `/sp.implement` - Execute tasks

## License

This project is developed for Hackathon Phase 2.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
