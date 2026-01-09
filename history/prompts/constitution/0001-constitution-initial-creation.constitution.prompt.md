---
id: 0001
title: Constitution Initial Creation for Full-Stack Todo App
stage: constitution
date: 2026-01-08
surface: cli
model: claude-opus-4-5
feature: none
branch: master
user: shaista-tosif
command: /sp.constitution
labels: [constitution, initial, multi-agent, ai-automation]
links:
  spec: N/A
  ticket: N/A
  adr: N/A
  pr: N/A
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

```text
Project Name:
Full-Stack Todo App by Shaista Tosif

1. Project Overview
Ye project ek AI-Powered Task & Automation Platform hai jo multi-agent architecture par based hai.
System tasks ko intelligently organize, automate, analyze aur suggest karega.

Frontend:
- Fully AI-assisted
- Modern & interactive dashboard
- Theme: Black / Charcoal + Orange

Backend:
- AI agents based task handling
- Automation-driven workflow

Ye project Claude Code ke zariye build hoga jahan Claude khud:
- Code generate
- AI-based Suggestions
- Multi-Agent Coordination

4. AI Automation Instructions
- Deadline near ho -> auto reminder
- Repetitive task ho -> automation suggestion
- Productivity drop ho -> AI insights
- Subagents independently kaam karein
- Final authority TaskMaster AI ke paas ho
- Dashboards real-time update hon:
  - Task status
  - Suggestions
  - Analytics

5. Frontend Specifications
Theme:
- Background: Black / Charcoal
- Highlights: Orange
- Accent: Soft Grey

Layout:
- Modern dashboard
- Widgets-based UI

UI Elements:
- Responsive task lists
- Subagent activity cards
- AI suggestion panel
- Interactive charts & graphs

Markup & Tech:
- HTML + CSS (Dark Theme)
- JavaScript / React (Dynamic AI UI)

6. Claude Code Integration Rules (IMPORTANT)
Claude Code ko ye constitution single prompt ke taur par di jayegi.
Claude automatically:
- Project structure generate karega
- Agents setup karega
- Frontend (Black/Orange) design karega
- AI automation simulate karega
- Modular & expandable code likhega

sab ap ko khud handle krna hy ok
```

## Response snapshot

Created project constitution v1.0.0 with 6 core principles:

1. **Multi-Agent Architecture**: Subagents work independently, TaskMaster AI has final authority
2. **AI-First Automation**: Auto-reminders, automation suggestions, productivity insights
3. **Dark Theme UI Standard**: Black (#1C1C1C) / Charcoal (#2A2A2A) with Orange (#FFA500) highlights
4. **Event-Driven Real-Time Updates**: Kafka + WebSocket + Dapr integration
5. **Hinglish Language Support**: Natural language task management in Hindi-English mix
6. **Modular & Expandable Code**: Microservices-ready, versioned APIs

Technical stack defined: Next.js 14+, FastAPI, Neon PostgreSQL, OpenAI Agents SDK, Docker/K8s

## Outcome

- Impact: Initial constitution created establishing project governance and principles
- Tests: N/A (documentation artifact)
- Files: .specify/memory/constitution.md (created)
- Next prompts: /sp.specify to create feature specifications
- Reflection: User provided comprehensive requirements in Hinglish; constitution captures all key principles including multi-agent architecture, AI automation rules, and visual identity

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
