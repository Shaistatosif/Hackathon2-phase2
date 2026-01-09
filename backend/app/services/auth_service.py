"""
Authentication service for user registration, login, and token management
"""
from datetime import timedelta
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.models import User
from app.schemas import TokenResponse, UserRegisterRequest, UserResponse


class AuthService:
    """Service for authentication operations"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def register(self, request: UserRegisterRequest) -> tuple[User, TokenResponse]:
        """
        Register a new user and return tokens.

        Args:
            request: User registration data

        Returns:
            Tuple of (User, TokenResponse)

        Raises:
            ValueError: If email already exists
        """
        # Check if email already exists
        existing = await self._get_user_by_email(request.email)
        if existing:
            raise ValueError("Email already registered")

        # Create user
        user = User(
            email=request.email,
            password_hash=get_password_hash(request.password),
            name=request.name,
        )
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)

        # Generate tokens
        tokens = self._generate_tokens(user.id)

        return user, tokens

    async def login(self, email: str, password: str) -> tuple[User, TokenResponse]:
        """
        Authenticate user and return tokens.

        Args:
            email: User email
            password: User password

        Returns:
            Tuple of (User, TokenResponse)

        Raises:
            ValueError: If credentials are invalid
        """
        user = await self._get_user_by_email(email)
        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(password, user.password_hash):
            raise ValueError("Invalid email or password")

        # Generate tokens
        tokens = self._generate_tokens(user.id)

        return user, tokens

    async def refresh_tokens(self, refresh_token: str) -> TokenResponse:
        """
        Refresh access token using refresh token.

        Args:
            refresh_token: Valid refresh token

        Returns:
            New TokenResponse

        Raises:
            ValueError: If refresh token is invalid
        """
        payload = decode_token(refresh_token)
        if not payload:
            raise ValueError("Invalid refresh token")

        if payload.get("type") != "refresh":
            raise ValueError("Invalid token type")

        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("Invalid refresh token")

        # Verify user still exists
        user = await self.get_user_by_id(UUID(user_id))
        if not user:
            raise ValueError("User not found")

        return self._generate_tokens(user.id)

    async def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID"""
        statement = select(User).where(User.id == user_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def _get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        statement = select(User).where(User.email == email)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    def _generate_tokens(self, user_id: UUID) -> TokenResponse:
        """Generate access and refresh tokens for user"""
        access_token = create_access_token(subject=user_id)
        refresh_token = create_refresh_token(subject=user_id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=24 * 60 * 60,  # 24 hours in seconds
        )


def get_auth_service(session: AsyncSession) -> AuthService:
    """Factory function to get AuthService instance"""
    return AuthService(session)
