"""Pydantic schemas package"""

from .auth import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    UserResponse,
    AuthErrorResponse,
)
from .task import (
    TaskCreateRequest,
    TaskUpdateRequest,
    TaskResponse,
    TaskListResponse,
    TaskFilterParams,
)
from .chat import (
    ChatMessageRequest,
    MessageResponse,
    TaskActionResponse,
    ChatMessageResponse,
    ConversationResponse,
    ChatHistoryResponse,
)

__all__ = [
    # Auth schemas
    "UserRegisterRequest",
    "UserLoginRequest",
    "TokenResponse",
    "RefreshTokenRequest",
    "UserResponse",
    "AuthErrorResponse",
    # Task schemas
    "TaskCreateRequest",
    "TaskUpdateRequest",
    "TaskResponse",
    "TaskListResponse",
    "TaskFilterParams",
    # Chat schemas
    "ChatMessageRequest",
    "MessageResponse",
    "TaskActionResponse",
    "ChatMessageResponse",
    "ConversationResponse",
    "ChatHistoryResponse",
]
