# Tasks: AI-Powered Todo Application

**Input**: Design documents from `/specs/001-todo-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL in this implementation. Include only if explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/app/` for source, `backend/tests/` for tests
- **Frontend**: `frontend/app/` for pages, `frontend/components/` for components
- **Infrastructure**: `infrastructure/` for Docker, K8s, Helm

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory structure per plan.md (backend/, frontend/, infrastructure/)
- [X] T002 Initialize Python backend with FastAPI in backend/requirements.txt and backend/main.py
- [X] T003 [P] Initialize Next.js 14+ frontend with TypeScript in frontend/package.json
- [X] T004 [P] Configure Tailwind CSS with dark theme in frontend/tailwind.config.ts
- [X] T005 [P] Setup Shadcn/UI components in frontend/components/ui/
- [X] T006 [P] Create .env.example files for backend and frontend
- [X] T007 [P] Create docker-compose.yml for local development in infrastructure/
- [X] T008 [P] Configure ESLint and Prettier for frontend in frontend/.eslintrc.js
- [X] T009 [P] Configure Black and isort for backend in backend/pyproject.toml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Database & ORM Setup

- [X] T010 Configure database connection in backend/app/core/database.py
- [X] T011 Initialize Alembic migrations in backend/alembic/
- [X] T012 [P] Create User model in backend/app/models/user.py
- [X] T013 [P] Create Task model in backend/app/models/task.py
- [X] T014 [P] Create Conversation model in backend/app/models/conversation.py
- [X] T015 [P] Create Message model in backend/app/models/message.py
- [X] T016 Create models/__init__.py exporting all models in backend/app/models/__init__.py
- [X] T017 Generate initial Alembic migration in backend/alembic/versions/

### Core Configuration

- [X] T018 [P] Create settings/config module in backend/app/core/config.py
- [X] T019 [P] Create security utilities (JWT, password hashing) in backend/app/core/security.py
- [X] T020 [P] Create TypeScript types from data-model.md in frontend/types/index.ts
- [X] T021 [P] Create API client base in frontend/lib/api.ts

### API Foundation

- [X] T022 Create FastAPI app instance with CORS in backend/main.py
- [X] T023 [P] Create auth Pydantic schemas in backend/app/schemas/auth.py
- [X] T024 [P] Create task Pydantic schemas in backend/app/schemas/task.py
- [X] T025 [P] Create chat Pydantic schemas in backend/app/schemas/chat.py
- [X] T026 Create schemas/__init__.py exporting all schemas in backend/app/schemas/__init__.py

### Frontend Foundation

- [X] T027 [P] Create root layout with dark theme in frontend/app/layout.tsx
- [X] T028 [P] Create landing page in frontend/app/page.tsx
- [X] T029 [P] Create Header component in frontend/components/layout/Header.tsx
- [X] T030 [P] Create Sidebar component in frontend/components/layout/Sidebar.tsx
- [X] T031 [P] Create global CSS with dark theme variables in frontend/app/globals.css

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1)

**Goal**: Enable users to register, login, and maintain secure sessions

**Independent Test**: Create an account, logout, login again to verify session persistence

### Backend Implementation for US1

- [X] T032 [US1] Implement AuthService with register/login/logout in backend/app/services/auth_service.py
- [X] T033 [US1] Create auth dependency for protected routes in backend/app/api/deps.py
- [X] T034 [US1] Implement POST /api/auth/register endpoint in backend/app/api/auth.py
- [X] T035 [US1] Implement POST /api/auth/login endpoint in backend/app/api/auth.py
- [X] T036 [US1] Implement POST /api/auth/logout endpoint in backend/app/api/auth.py
- [X] T037 [US1] Implement POST /api/auth/refresh endpoint in backend/app/api/auth.py
- [X] T038 [US1] Implement GET /api/auth/me endpoint in backend/app/api/auth.py
- [X] T039 [US1] Register auth router in backend/main.py

### Frontend Implementation for US1

- [X] T040 [P] [US1] Configure Better Auth in frontend/lib/auth.ts
- [X] T041 [P] [US1] Create login page in frontend/app/(auth)/login/page.tsx
- [X] T042 [P] [US1] Create register page in frontend/app/(auth)/register/page.tsx
- [X] T043 [US1] Create auth middleware for protected routes in frontend/middleware.ts
- [X] T044 [US1] Add login/logout buttons to Header in frontend/components/layout/Header.tsx
- [X] T045 [US1] Create useAuth hook in frontend/hooks/useAuth.ts

**Checkpoint**: User Story 1 complete - users can register, login, and logout

---

## Phase 4: User Story 2 - Task CRUD Operations (Priority: P1)

**Goal**: Enable authenticated users to create, view, edit, and delete tasks

**Independent Test**: Create a task, view it in the list, edit its title, delete it

### Backend Implementation for US2

- [X] T046 [US2] Implement TaskService with CRUD operations in backend/app/services/task_service.py
- [X] T047 [US2] Implement GET /api/tasks endpoint (list with filters) in backend/app/api/tasks.py
- [X] T048 [US2] Implement POST /api/tasks endpoint in backend/app/api/tasks.py
- [X] T049 [US2] Implement GET /api/tasks/{id} endpoint in backend/app/api/tasks.py
- [X] T050 [US2] Implement PUT /api/tasks/{id} endpoint in backend/app/api/tasks.py
- [X] T051 [US2] Implement DELETE /api/tasks/{id} endpoint in backend/app/api/tasks.py
- [X] T052 [US2] Implement POST /api/tasks/{id}/complete endpoint in backend/app/api/tasks.py
- [X] T053 [US2] Register tasks router in backend/main.py

### Frontend Implementation for US2

- [X] T054 [P] [US2] Create TaskCard component in frontend/components/tasks/TaskCard.tsx
- [X] T055 [P] [US2] Create TaskList component in frontend/components/tasks/TaskList.tsx
- [X] T056 [P] [US2] Create TaskForm component (create/edit) in frontend/components/tasks/TaskForm.tsx
- [X] T057 [US2] Create dashboard page with task list in frontend/app/dashboard/page.tsx
- [X] T058 [US2] Create useTasks hook for task operations in frontend/hooks/useTasks.ts
- [X] T059 [US2] Add task status toggle (pending/in-progress/completed) in TaskCard
- [X] T060 [US2] Add delete confirmation modal in frontend/components/ui/ConfirmDialog.tsx

**Checkpoint**: User Story 2 complete - full task CRUD functionality working

---

## Phase 5: User Story 3 - AI Chatbot Task Management (Priority: P2)

**Goal**: Enable natural language task management with Hinglish support

**Independent Test**: Send "Add task: Buy groceries" and verify task is created

### Backend Implementation for US3

- [X] T061 [US3] Create MCP tool: add_task in backend/app/agents/tools/add_task.py
- [X] T062 [P] [US3] Create MCP tool: list_tasks in backend/app/agents/tools/list_tasks.py
- [X] T063 [P] [US3] Create MCP tool: complete_task in backend/app/agents/tools/complete_task.py
- [X] T064 [P] [US3] Create MCP tool: update_task in backend/app/agents/tools/update_task.py
- [X] T065 [P] [US3] Create MCP tool: delete_task in backend/app/agents/tools/delete_task.py
- [X] T066 [US3] Create AI coordinator with OpenAI Agents SDK in backend/app/agents/coordinator.py
- [X] T067 [US3] Implement ChatService with conversation management in backend/app/services/chat_service.py
- [X] T068 [US3] Add Hinglish system prompt for chatbot in backend/app/agents/prompts.py
- [X] T069 [US3] Implement POST /api/chat/message endpoint in backend/app/api/chat.py
- [X] T070 [US3] Implement GET /api/chat/history endpoint in backend/app/api/chat.py
- [X] T071 [US3] Implement DELETE /api/chat/history endpoint in backend/app/api/chat.py
- [X] T072 [US3] Register chat router in backend/main.py

### Frontend Implementation for US3

- [X] T073 [P] [US3] Create ChatWindow component in frontend/components/chat/ChatWindow.tsx
- [X] T074 [P] [US3] Create MessageBubble component in frontend/components/chat/MessageBubble.tsx
- [X] T075 [P] [US3] Create ChatInput component in frontend/components/chat/ChatInput.tsx
- [X] T076 [US3] Create chat page in frontend/app/chat/page.tsx
- [X] T077 [US3] Create useChat hook for chat operations in frontend/hooks/useChat.ts
- [X] T078 [US3] Add typing indicator while waiting for AI response in ChatWindow
- [X] T079 [US3] Display task action confirmations in chat responses in MessageBubble

**Checkpoint**: User Story 3 complete - AI chatbot with Hinglish support working

---

## Phase 6: User Story 4 - Task Filtering, Search, and Sorting (Priority: P2)

**Goal**: Enable users to filter, search, and sort their task list

**Independent Test**: Create tasks with different priorities, apply filter, verify correct results

### Backend Implementation for US4

- [X] T080 [US4] Add filter parameters (status, priority) to GET /api/tasks in backend/app/api/tasks.py
- [X] T081 [US4] Add search parameter (keyword) to GET /api/tasks in backend/app/api/tasks.py
- [X] T082 [US4] Add sort parameters (sortBy, sortOrder) to GET /api/tasks in backend/app/api/tasks.py
- [X] T083 [US4] Update TaskService with filter/search/sort logic in backend/app/services/task_service.py

### Frontend Implementation for US4

- [X] T084 [US4] Create TaskFilters component in frontend/components/tasks/TaskFilters.tsx
- [X] T085 [US4] Add status filter dropdown in TaskFilters
- [X] T086 [US4] Add priority filter dropdown in TaskFilters
- [X] T087 [US4] Add search input box in TaskFilters
- [X] T088 [US4] Add sort dropdown (by date, priority, creation) in TaskFilters
- [X] T089 [US4] Integrate TaskFilters with dashboard page in frontend/app/dashboard/page.tsx
- [X] T090 [US4] Update useTasks hook with filter/search/sort parameters

**Checkpoint**: User Story 4 complete - filtering, search, and sorting working

---

## Phase 7: User Story 5 - AI-Powered Automation and Insights (Priority: P3)

**Goal**: Provide automatic reminders, pattern detection, and productivity insights

**Independent Test**: Create task with due date tomorrow, verify reminder notification appears

### Backend Implementation for US5

- [ ] T091 [US5] Create AIService for automation in backend/app/services/ai_service.py
- [ ] T092 [US5] Implement deadline reminder detection in AIService
- [ ] T093 [US5] Implement repetitive task pattern detection in AIService
- [ ] T094 [US5] Implement productivity analytics calculation in AIService
- [ ] T095 [US5] Create scheduled job for reminder checking (Dapr) in backend/app/events/scheduler.py
- [ ] T096 [US5] Implement GET /api/analytics/productivity endpoint in backend/app/api/analytics.py
- [ ] T097 [US5] Implement GET /api/suggestions endpoint in backend/app/api/suggestions.py

### Frontend Implementation for US5

- [ ] T098 [P] [US5] Create StatsWidget for productivity metrics in frontend/components/dashboard/StatsWidget.tsx
- [ ] T099 [P] [US5] Create SuggestionsWidget for AI suggestions in frontend/components/dashboard/SuggestionsWidget.tsx
- [ ] T100 [P] [US5] Create NotificationToast component in frontend/components/ui/NotificationToast.tsx
- [ ] T101 [US5] Create analytics page in frontend/app/analytics/page.tsx
- [ ] T102 [US5] Add widgets to dashboard in frontend/app/dashboard/page.tsx
- [ ] T103 [US5] Create useAnalytics hook in frontend/hooks/useAnalytics.ts

**Checkpoint**: User Story 5 complete - AI automation and insights working

---

## Phase 8: User Story 6 - Real-Time Dashboard Updates (Priority: P3)

**Goal**: Enable real-time updates across all connected clients

**Independent Test**: Open two browser tabs, create task in one, verify it appears in the other

### Backend Implementation for US6

- [ ] T104 [US6] Create Kafka producer in backend/app/events/kafka_producer.py
- [ ] T105 [US6] Create Kafka consumer in backend/app/events/kafka_consumer.py
- [ ] T106 [US6] Implement WebSocket endpoint in backend/app/api/websocket.py
- [ ] T107 [US6] Publish task events (created, updated, deleted) to Kafka in TaskService
- [ ] T108 [US6] Consume Kafka events and broadcast via WebSocket in kafka_consumer.py
- [ ] T109 [US6] Configure Dapr pub/sub component in infrastructure/k8s/dapr/pubsub.yaml

### Frontend Implementation for US6

- [ ] T110 [US6] Create WebSocket client in frontend/lib/websocket.ts
- [ ] T111 [US6] Create useWebSocket hook in frontend/hooks/useWebSocket.ts
- [ ] T112 [US6] Integrate WebSocket updates with useTasks hook
- [ ] T113 [US6] Add real-time notification display in Header
- [ ] T114 [US6] Create ActivityWidget for real-time activity feed in frontend/components/dashboard/ActivityWidget.tsx

**Checkpoint**: User Story 6 complete - real-time updates working across clients

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, infrastructure, and deployment preparation

### Infrastructure Setup

- [X] T115 [P] Create backend Dockerfile in infrastructure/docker/backend.Dockerfile
- [X] T116 [P] Create frontend Dockerfile in infrastructure/docker/frontend.Dockerfile
- [X] T117 [P] Create Kubernetes deployment for backend in infrastructure/k8s/backend/
- [X] T118 [P] Create Kubernetes deployment for frontend in infrastructure/k8s/frontend/
- [X] T119 [P] Create Kafka deployment manifest in infrastructure/k8s/kafka/kafka.yaml
- [X] T120 [P] Create Dapr state store component in infrastructure/k8s/dapr/statestore.yaml
- [X] T121 Create Ingress configuration in infrastructure/k8s/ingress.yaml
- [X] T122 Create Helm chart in infrastructure/helm/todo-app/

### Final Polish

- [X] T123 [P] Add error handling and loading states to all frontend pages
- [X] T124 [P] Add form validation error messages in all forms
- [X] T125 Run Lighthouse audit and fix accessibility issues
- [X] T126 Verify dark theme compliance (Black #1C1C1C, Charcoal #2A2A2A, Orange #FFA500)
- [X] T127 Run quickstart.md validation end-to-end
- [X] T128 Security review: ensure JWT validation on all protected routes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - No dependencies on other stories
- **User Story 2 (Phase 4)**: Depends on Foundational + User Story 1 (auth required for tasks)
- **User Story 3 (Phase 5)**: Depends on User Story 2 (needs task operations)
- **User Story 4 (Phase 6)**: Depends on User Story 2 (enhances task list)
- **User Story 5 (Phase 7)**: Depends on User Story 2 (needs task data)
- **User Story 6 (Phase 8)**: Depends on User Story 2 (needs task events)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (Auth) | Foundational | Phase 2 complete |
| US2 (Tasks) | US1 | Phase 3 complete |
| US3 (Chatbot) | US2 | Phase 4 complete |
| US4 (Filters) | US2 | Phase 4 complete |
| US5 (AI Insights) | US2 | Phase 4 complete |
| US6 (Real-Time) | US2 | Phase 4 complete |

**Note**: US3, US4, US5, US6 can run in parallel after US2 is complete.

### Within Each User Story

1. Backend models/services first
2. Backend API endpoints second
3. Frontend components third
4. Frontend pages/integration last

### Parallel Opportunities

**Phase 1 (Setup)**:
```bash
# All can run in parallel:
T003, T004, T005, T006, T007, T008, T009
```

**Phase 2 (Foundational)**:
```bash
# Models can run in parallel:
T012, T013, T014, T015

# Frontend foundation can run in parallel:
T027, T028, T029, T030, T031
```

**Phase 3 (US1 Frontend)**:
```bash
# These can run in parallel:
T040, T041, T042
```

**After Phase 4 (US2) completes**:
```bash
# US3, US4, US5, US6 can all start in parallel
Phase 5, Phase 6, Phase 7, Phase 8
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Authentication)
4. Complete Phase 4: User Story 2 (Task CRUD)
5. **STOP and VALIDATE**: Full auth + task management working
6. Deploy MVP

### Incremental Delivery

1. Setup + Foundational + US1 + US2 = MVP
2. Add US3 (Chatbot) = AI differentiator
3. Add US4 (Filters) = Productivity enhancement
4. Add US5 (AI Insights) = Advanced features
5. Add US6 (Real-Time) = Enhanced UX
6. Polish phase = Production ready

### Parallel Team Strategy

With multiple developers after Phase 4:

- Developer A: User Story 3 (Chatbot)
- Developer B: User Story 4 (Filters)
- Developer C: User Story 5 (AI Insights)
- Developer D: User Story 6 (Real-Time)

---

## Task Summary

| Phase | Story | Task Count | Parallel Tasks |
|-------|-------|------------|----------------|
| Phase 1 | Setup | 9 | 7 |
| Phase 2 | Foundational | 22 | 14 |
| Phase 3 | US1 (Auth) | 14 | 3 |
| Phase 4 | US2 (Tasks) | 14 | 3 |
| Phase 5 | US3 (Chatbot) | 19 | 7 |
| Phase 6 | US4 (Filters) | 11 | 0 |
| Phase 7 | US5 (AI) | 13 | 3 |
| Phase 8 | US6 (Real-Time) | 11 | 0 |
| Phase 9 | Polish | 14 | 8 |
| **Total** | | **127** | **45** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label (US1, US2, etc.) maps task to specific user story
- Each user story is independently testable after completion
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP = Phase 1 + Phase 2 + Phase 3 + Phase 4 (Setup + Foundation + Auth + Tasks)
