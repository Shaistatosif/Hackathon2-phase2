# Research: AI-Powered Todo Application

**Feature Branch**: `001-todo-app`
**Date**: 2026-01-08
**Status**: Complete

## Technology Research

### 1. Better Auth Integration with Next.js 14+

**Decision**: Use Better Auth as the authentication framework with JWT sessions

**Rationale**:
- Constitution mandates Better Auth for authentication
- Native Next.js App Router support
- Built-in session management with JWT tokens
- Easy integration with FastAPI backend via API calls

**Alternatives Considered**:
- NextAuth.js: Good but Better Auth specified in constitution
- Auth0: Third-party dependency, adds complexity
- Custom JWT: More work, reinventing the wheel

**Implementation Notes**:
- Configure Better Auth in `frontend/lib/auth.ts`
- Use middleware for protected routes
- Pass JWT token to backend API calls in Authorization header

### 2. OpenAI Agents SDK for Multi-Agent Architecture

**Decision**: Use OpenAI Agents SDK with MCP tools for task operations

**Rationale**:
- Constitution requires OpenAI Agents SDK for agent orchestration
- MCP (Model Context Protocol) tools provide structured function calling
- Supports multi-agent coordination with clear boundaries

**Alternatives Considered**:
- LangChain: More complex, not specified in constitution
- Custom agent implementation: Reinventing the wheel
- Direct OpenAI API: Lacks agent orchestration features

**Implementation Notes**:
- Define MCP tools: add_task, list_tasks, complete_task, update_task, delete_task
- Use GPT-4o or GPT-4o-mini for Hinglish language understanding
- Implement conversation memory via database persistence
- Coordinator pattern: TaskMaster AI routes to appropriate tools

### 3. Hinglish Language Support

**Decision**: Use GPT-4o with system prompts for Hinglish understanding

**Rationale**:
- GPT-4o has excellent multilingual capabilities including Hindi
- System prompt can instruct model to understand and respond in Hinglish
- No additional NLU pipeline required

**Alternatives Considered**:
- Custom NLU model: Expensive to train, maintenance burden
- Translation layer: Loses nuance of code-mixing
- Separate Hindi and English models: Complexity without benefit

**Implementation Notes**:
- System prompt: "You understand and respond to commands in Hinglish (mixed Hindi-English). Common patterns: 'karo' = do/complete, 'dikhao' = show, 'add karo' = add, 'delete karo' = delete"
- Examples in system prompt for each command type
- Test with common Hinglish phrases from target users

### 4. Real-Time Updates Architecture

**Decision**: Kafka for backend events + WebSocket for frontend updates

**Rationale**:
- Constitution mandates Kafka + WebSocket + Dapr
- Kafka provides durable event streaming between services
- WebSocket enables instant frontend updates
- Dapr simplifies pub/sub and state management

**Alternatives Considered**:
- Server-Sent Events (SSE): Simpler but less robust for bidirectional
- Polling: Inefficient, doesn't meet <1s update requirement
- Firebase Realtime: Third-party, adds dependency

**Implementation Notes**:
- Kafka topics: `task-created`, `task-updated`, `task-deleted`, `reminder-triggered`
- Backend publishes to Kafka on state changes
- Dedicated WebSocket service subscribes to Kafka and pushes to connected clients
- Frontend maintains WebSocket connection and updates React state

### 5. Neon PostgreSQL with SQLModel

**Decision**: Use Neon PostgreSQL with SQLModel ORM and asyncpg driver

**Rationale**:
- Constitution specifies Neon PostgreSQL (serverless)
- SQLModel provides type safety with Pydantic integration
- asyncpg enables async database operations for FastAPI

**Alternatives Considered**:
- Supabase: Different PostgreSQL provider than specified
- MongoDB: Not relational, doesn't match entity relationships
- SQLAlchemy alone: SQLModel provides better Pydantic integration

**Implementation Notes**:
- Connection string from environment variable
- Use Alembic for database migrations
- Connection pooling via asyncpg for concurrent requests
- Implement soft deletes for data recovery

### 6. Dark Theme with Tailwind CSS

**Decision**: Tailwind CSS with custom theme configuration

**Rationale**:
- Constitution specifies exact colors: Black #1C1C1C, Charcoal #2A2A2A, Orange #FFA500
- Tailwind allows custom theme extension
- Shadcn/UI components are Tailwind-based

**Alternatives Considered**:
- CSS-in-JS (Emotion/Styled): More runtime overhead
- Plain CSS: Less maintainable at scale
- Material UI: Different design system, harder to customize

**Implementation Notes**:
```js
// tailwind.config.ts theme extension
colors: {
  background: '#1C1C1C',
  card: '#2A2A2A',
  primary: '#FFA500',
  'primary-hover': '#FF8C00',
  muted: '#4A4A4A',
  text: '#FFFFFF',
  'text-muted': '#A0A0A0'
}
```

### 7. ChatKit for Chatbot UI

**Decision**: Use ChatKit library for chat interface components

**Rationale**:
- Constitution specifies ChatKit for AI chatbot interface
- Pre-built message bubbles, input components, typing indicators
- Customizable to match dark theme

**Alternatives Considered**:
- Custom chat components: More development time
- Stream Chat: Paid service, adds dependency
- React Chat UI: Less feature-complete

**Implementation Notes**:
- Customize ChatKit theme to match dark theme colors
- Integrate with WebSocket for real-time message updates
- Show typing indicator while waiting for AI response

### 8. Dapr Integration

**Decision**: Use Dapr sidecar for pub/sub, state management, and secrets

**Rationale**:
- Constitution mandates Dapr for sidecar runtime
- Simplifies Kafka integration via pub/sub building block
- Provides secret management for API keys

**Alternatives Considered**:
- Direct Kafka client: More complex configuration
- Kubernetes secrets only: Less portable
- Consul: Different tool, not specified

**Implementation Notes**:
- Dapr pub/sub component for Kafka
- Dapr state store for session management
- Dapr secrets for OpenAI API key, database credentials
- HTTP API calls to Dapr sidecar from backend

## Best Practices Research

### FastAPI Async Patterns

- Use `async def` for all route handlers
- Use `asyncpg` for non-blocking database operations
- Implement dependency injection for database sessions
- Use background tasks for Kafka publishing

### Next.js App Router Patterns

- Use Server Components for initial data fetching
- Client Components for interactive elements (forms, chat)
- Implement loading.tsx and error.tsx for UX
- Use `use client` directive only where needed

### Kubernetes Deployment Patterns

- Horizontal Pod Autoscaler for backend scaling
- Readiness/liveness probes for health checks
- ConfigMaps for non-sensitive configuration
- Secrets for sensitive data (via Dapr)

## Unresolved Questions

All technical decisions have been made. No remaining NEEDS CLARIFICATION items.

## References

- [Better Auth Documentation](https://better-auth.com/docs)
- [OpenAI Agents SDK](https://platform.openai.com/docs/agents)
- [FastAPI Best Practices](https://fastapi.tiangolo.com/advanced/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Dapr Building Blocks](https://docs.dapr.io/concepts/building-blocks-concept/)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
