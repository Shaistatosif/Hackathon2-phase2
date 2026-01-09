# Quick Start Guide

This guide will help you get the AI-Powered Todo App running locally in minutes.

## Prerequisites

- **Python 3.12+** with pip
- **Node.js 20+** with npm
- **PostgreSQL** (or Neon PostgreSQL account)
- **OpenAI API Key** (for AI chatbot features)
- **Docker & Docker Compose** (optional, for containerized setup)

## Option 1: Local Development Setup

### 1. Clone and Setup

```bash
# Clone the repository
cd Hackathon2-phase2

# Setup Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy environment file and configure
cp .env.example .env
# Edit .env with your database URL and OpenAI API key

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start the development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Option 2: Docker Compose Setup

### 1. Configure Environment

```bash
# Create .env file at root with your secrets
echo "OPENAI_API_KEY=your-api-key" > .env
```

### 2. Start All Services

```bash
cd infrastructure
docker-compose up -d
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## Option 3: Kubernetes (Minikube)

### 1. Start Minikube

```bash
minikube start
eval $(minikube docker-env)
```

### 2. Build Images

```bash
docker build -t todo-backend:latest -f infrastructure/docker/backend.Dockerfile .
docker build -t todo-frontend:latest -f infrastructure/docker/frontend.Dockerfile .
```

### 3. Deploy with Helm

```bash
cd infrastructure/helm/todo-app

# Edit values.yaml with your configuration
helm install todo-app . --namespace todo-app --create-namespace
```

### 4. Access via Ingress

```bash
minikube addons enable ingress
echo "$(minikube ip) todo.local" | sudo tee -a /etc/hosts
# Access at http://todo.local
```

## Features to Try

### 1. User Registration & Login
- Create an account at `/register`
- Login at `/login`

### 2. Task Management
- Create, edit, and delete tasks
- Filter by status and priority
- Search tasks by title

### 3. AI Chatbot (Hinglish Support)
- Navigate to `/chat`
- Try commands like:
  - "Add task: Buy groceries"
  - "Mujhe pending tasks dikhao"
  - "Complete grocery task"
  - "High priority task add karo - Meeting prepare karna hai"

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `OPENAI_API_KEY` | OpenAI API key for chatbot | Yes |
| `OPENAI_MODEL` | OpenAI model (default: gpt-4o-mini) | No |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka servers for events | No |

### Frontend (.env.local)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `BETTER_AUTH_SECRET` | Auth secret key | Yes |

## Troubleshooting

### Database Connection Issues
```bash
# Verify PostgreSQL is running
psql -h localhost -U todouser -d todoapp

# Run migrations
cd backend && alembic upgrade head
```

### OpenAI API Errors
- Verify your API key is valid
- Check if you have credits remaining
- Ensure the model name is correct

### CORS Errors
- Check `CORS_ORIGINS` in backend .env
- Ensure frontend URL is in the allowed list

## Support

- Check the `/docs` endpoint for API documentation
- Review `CLAUDE.md` for project guidelines
- Open an issue on GitHub for bugs
