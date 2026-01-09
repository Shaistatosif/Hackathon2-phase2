"""
Authentication API endpoints
"""
from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DbSession
from app.schemas import (
    RefreshTokenRequest,
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from app.services.auth_service import get_auth_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user",
    description="Create a new user account and return authentication tokens.",
)
async def register(
    request: UserRegisterRequest,
    session: DbSession,
) -> TokenResponse:
    """
    Register a new user.

    - **email**: Valid email address (unique)
    - **password**: Minimum 8 characters, must contain uppercase, lowercase, and digit
    - **name**: User display name (1-100 characters)
    """
    auth_service = get_auth_service(session)

    try:
        _, tokens = await auth_service.register(request)
        return tokens
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/login",
    response_model=TokenResponse,
    response_model_by_alias=True,
    summary="Login user",
    description="Authenticate user with email and password.",
)
async def login(
    request: UserLoginRequest,
    session: DbSession,
) -> TokenResponse:
    """
    Authenticate user and return tokens.

    - **email**: Registered email address
    - **password**: User password
    """
    auth_service = get_auth_service(session)

    try:
        _, tokens = await auth_service.login(request.email, request.password)
        return tokens
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Logout user",
    description="Invalidate user session (client should discard tokens).",
)
async def logout(
    current_user: CurrentUser,
) -> None:
    """
    Logout current user.

    Note: JWT tokens are stateless, so this endpoint just confirms
    the user is authenticated. Client should discard tokens.
    """
    # JWT is stateless - client should discard tokens
    # In production, you might want to implement token blacklisting
    return None


@router.post(
    "/refresh",
    response_model=TokenResponse,
    response_model_by_alias=True,
    summary="Refresh tokens",
    description="Get new access token using refresh token.",
)
async def refresh_token(
    request: RefreshTokenRequest,
    session: DbSession,
) -> TokenResponse:
    """
    Refresh authentication tokens.

    - **refresh_token**: Valid refresh token
    """
    auth_service = get_auth_service(session)

    try:
        tokens = await auth_service.refresh_tokens(request.refresh_token)
        return tokens
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
    description="Get profile information of authenticated user.",
)
async def get_me(
    current_user: CurrentUser,
) -> UserResponse:
    """
    Get current authenticated user profile.

    Requires valid access token in Authorization header.
    """
    return UserResponse.model_validate(current_user)
