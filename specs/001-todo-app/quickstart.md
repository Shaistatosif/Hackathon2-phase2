# Quickstart Guide: AI-Powered Todo Application

**Feature Branch**: `001-todo-app`
**Date**: 2026-01-08

## Prerequisites

- Node.js 20+ and npm/pnpm
- Python 3.11+
- Docker and Docker Compose
- Minikube (for Kubernetes local deployment)
- Git

## Environment Setup

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd Hackathon2-phase2
git checkout 001-todo-app
```

### 2. Environment Variables

Create `.env` files from templates:

**Backend** (`backend/.env`):
```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/todoapp

# JWT Settings
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Dapr
DAPR_HTTP_PORT=3500
```

**Frontend** (`frontend/.env.local`):
```bash
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws

# Better Auth
BETTER_AUTH_SECRET=your-auth-secret
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Install Dependencies

**Backend**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend**:
```bash
cd frontend
pnpm install  # or npm install
```

## Local Development (Docker Compose)

The easiest way to run all services locally:

```bash
# From repository root
docker-compose up -d

# This starts:
# - PostgreSQL (port 5432)
# - Kafka + Zookeeper (port 9092)
# - Backend API (port 8000)
# - Frontend (port 3000)
```

### Individual Service Development

If you prefer running services individually:

**1. Start Database and Kafka**:
```bash
docker-compose up -d postgres kafka zookeeper
```

**2. Run Backend**:
```bash
cd backend
source venv/bin/activate
alembic upgrade head  # Run migrations
uvicorn main:app --reload --port 8000
```

**3. Run Frontend**:
```bash
cd frontend
pnpm dev  # or npm run dev
```

## Database Migrations

```bash
cd backend
source venv/bin/activate

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

## Running Tests

**Backend Tests**:
```bash
cd backend
pytest tests/ -v
pytest tests/unit/ -v          # Unit tests only
pytest tests/integration/ -v   # Integration tests only
```

**Frontend Tests**:
```bash
cd frontend
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests with Playwright
```

## API Documentation

When the backend is running, access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

## Kubernetes Deployment (Minikube)

### 1. Start Minikube

```bash
minikube start --cpus=4 --memory=8192

# Enable required addons
minikube addons enable ingress
minikube addons enable metrics-server
```

### 2. Install Dapr

```bash
dapr init -k --wait
```

### 3. Build and Deploy

```bash
# Point Docker to Minikube
eval $(minikube docker-env)

# Build images
docker build -t todo-app-backend:latest -f infrastructure/docker/backend.Dockerfile backend/
docker build -t todo-app-frontend:latest -f infrastructure/docker/frontend.Dockerfile frontend/

# Apply Kubernetes manifests
kubectl apply -f infrastructure/k8s/
```

### 4. Access Application

```bash
# Get Minikube IP
minikube ip

# Or use tunnel
minikube tunnel

# Access at http://localhost or http://<minikube-ip>
```

## Common Tasks

### Add a New Task via API

```bash
# Login first
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.accessToken')

# Create task
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My new task","priority":"high"}'
```

### Test Chatbot (Hinglish)

```bash
curl -X POST http://localhost:8000/api/chat/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Meri pending tasks dikhao"}'
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres
```

### Kafka Issues
```bash
# Check Kafka and Zookeeper
docker-compose ps kafka zookeeper

# Reset Kafka (warning: deletes all messages)
docker-compose down kafka zookeeper
docker volume rm hackathon2-phase2_kafka_data
docker-compose up -d kafka zookeeper
```

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf frontend/node_modules frontend/.next
cd frontend && pnpm install && pnpm build
```

## Verification Checklist

After setup, verify:

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:8000/docs
- [ ] Can register a new user
- [ ] Can login and see dashboard
- [ ] Can create, edit, delete tasks
- [ ] Chatbot responds to messages
- [ ] Dark theme displays correctly (black/charcoal background, orange highlights)

## Next Steps

1. Review [spec.md](./spec.md) for feature requirements
2. Review [data-model.md](./data-model.md) for database schema
3. Check [contracts/](./contracts/) for API specifications
4. Run `/sp.tasks` to generate implementation tasks
