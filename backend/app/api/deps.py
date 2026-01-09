"""
API dependencies for dependency injection
"""
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import decode_token
from app.models import User
from app.services.auth_service import AuthService, get_auth_service

# Security scheme
security = HTTPBearer()


async def get_db() -> AsyncSession:
    """Dependency to get database session"""
    async for session in get_session():
        yield session


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    session: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """
    Dependency to get current authenticated user from JWT token.

    Args:
        credentials: HTTP Bearer token
        session: Database session

    Returns:
        Authenticated User

    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise credentials_exception

    if payload.get("type") != "access":
        raise credentials_exception

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise credentials_exception

    try:
        user_id = UUID(user_id_str)
    except ValueError:
        raise credentials_exception

    auth_service = get_auth_service(session)
    user = await auth_service.get_user_by_id(user_id)

    if not user:
        raise credentials_exception

    return user


async def get_current_user_optional(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(HTTPBearer(auto_error=False))],
    session: Annotated[AsyncSession, Depends(get_db)],
) -> User | None:
    """
    Optional dependency to get current user if authenticated.

    Returns None if no valid token is provided.
    """
    if not credentials:
        return None

    try:
        return await get_current_user(credentials, session)
    except HTTPException:
        return None


# Type aliases for cleaner dependency injection
DbSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]
OptionalUser = Annotated[User | None, Depends(get_current_user_optional)]
