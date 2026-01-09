<!--
  Sync Impact Report
  ==================
  Version change: N/A (initial) -> 1.0.0

  Modified principles: None (initial creation)

  Added sections:
  - Core Principles (6 principles)
  - Technical Requirements
  - Development Workflow
  - Governance

  Removed sections: None (initial creation)

  Templates requiring updates:
  - .specify/templates/plan-template.md: Constitution Check section compatible
  - .specify/templates/spec-template.md: User scenarios aligned with AI automation
  - .specify/templates/tasks-template.md: Task categories support multi-agent workflow

  Follow-up TODOs: None
-->

# Full-Stack Todo App Constitution

## Core Principles

### I. Multi-Agent Architecture
The system MUST operate on a multi-agent architecture where:
- Subagents work independently on their designated domains
- TaskMaster AI (todo-master-coordinator) holds final authority over all decisions
- Agents MUST coordinate through defined interfaces, never bypass the orchestration layer
- Each agent has clear boundaries: api-database-agent, ui-ux-frontend-specialist,
  conversational-agent, cloud-deployment-agent

**Rationale**: Multi-agent architecture ensures scalability, separation of concerns,
and enables parallel task processing while maintaining coordinated control.

### II. AI-First Automation
All automation decisions MUST be AI-driven:
- Deadline approaching: auto-reminder generation REQUIRED
- Repetitive task detection: automation suggestions REQUIRED
- Productivity drop detection: AI insights REQUIRED
- Dashboards MUST update in real-time with task status, suggestions, and analytics

**Rationale**: AI-first approach maximizes user productivity by proactively
handling routine decisions and surfacing actionable insights.

### III. Dark Theme UI Standard
Frontend MUST adhere to the established visual identity:
- Background: Black (#1C1C1C) / Charcoal (#2A2A2A)
- Highlights: Orange (#FFA500)
- Accent: Soft Grey
- All UI components MUST use modern, widget-based dashboard layouts
- Interactive elements MUST include hover effects and transitions

**Rationale**: Consistent dark theme with orange highlights creates visual
cohesion and reduces eye strain during extended usage.

### IV. Event-Driven Real-Time Updates
The system MUST be event-driven:
- Kafka for event streaming between services
- WebSocket for real-time frontend updates
- Dapr for pub/sub, state management, and service invocation
- All state changes MUST propagate through event channels

**Rationale**: Event-driven architecture enables loose coupling, scalability,
and real-time user experience.

### V. Hinglish Language Support (NON-NEGOTIABLE)
The AI chatbot MUST support Hinglish (Hindi-English mix):
- Natural language understanding for task commands
- Commands: "Add task", "Show pending tasks", "Complete task"
- Responses MUST be conversational with confirmation and error handling
- Persistent conversation memory REQUIRED

**Rationale**: Hinglish support enables natural interaction for target users
who communicate in mixed language patterns.

### VI. Modular & Expandable Code
All code MUST be modular and expandable:
- Features MUST be independently deployable microservices
- No tight coupling between frontend and backend
- API contracts MUST be versioned
- Claude Code will auto-generate project structure, agents, and frontend designs

**Rationale**: Modularity ensures the system can evolve without large-scale
rewrites and supports incremental feature delivery.

## Technical Requirements

### Technology Stack (NON-NEGOTIABLE)

**Frontend**:
- Next.js 14+ with App Router
- React 18+ with TypeScript
- Tailwind CSS with Shadcn/UI components
- ChatKit for AI chatbot interface
- Better Auth for authentication

**Backend**:
- FastAPI with async support
- SQLModel ORM with asyncpg driver
- Pydantic for validation
- Alembic for migrations

**Database**: Neon PostgreSQL (serverless)

**AI/Agent Stack**:
- OpenAI GPT for language model
- OpenAI Agents SDK for agent orchestration
- MCP Tools for AI tool execution

**Infrastructure**:
- Docker for containerization
- Kubernetes (Minikube local, AKS/GKE/OKE cloud)
- Helm for package management
- Dapr for sidecar runtime

### Performance Standards

- API response time: < 200ms (p95)
- Chatbot response time: < 2s
- Support 1000+ concurrent users
- 99.9% uptime SLO

## Development Workflow

### Spec-Driven Development (SDD)
All features MUST follow the SDD workflow:

```
SPECIFY -> PLAN -> TASKS -> IMPLEMENT -> TEST
```

### Required Artifacts
- Feature specifications in `specs/<feature>/spec.md`
- Architecture plans in `specs/<feature>/plan.md`
- Implementation tasks in `specs/<feature>/tasks.md`
- Prompt History Records (PHR) for all significant interactions
- Architecture Decision Records (ADR) for significant decisions (with user consent)

### Git Workflow
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Quality Gates
- All PRs MUST verify constitution compliance
- Complexity MUST be justified in Complexity Tracking table
- No secrets in code (use `.env` files)
- Code references MUST cite file paths

## Governance

### Amendment Procedure
1. Propose changes via documented PHR
2. Require explicit user approval for changes
3. Update dependent templates if principles change
4. Increment version per semantic versioning

### Versioning Policy
- MAJOR: Backward incompatible principle removals or redefinitions
- MINOR: New principle/section added or materially expanded
- PATCH: Clarifications, wording, typo fixes

### Compliance Review
- Constitution supersedes all other practices
- All agents MUST verify compliance before actions
- Violations MUST be documented and escalated

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
