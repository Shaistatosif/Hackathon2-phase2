"""
Authentication Pydantic schemas
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRegisterRequest(BaseModel):
    """Schema for user registration request"""

    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    name: str = Field(..., min_length=1, max_length=100)

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserLoginRequest(BaseModel):
    """Schema for user login request"""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for token response"""

    access_token: str = Field(..., serialization_alias="accessToken")
    refresh_token: str = Field(..., serialization_alias="refreshToken")
    token_type: str = Field(default="bearer", serialization_alias="tokenType")
    expires_in: int = Field(..., serialization_alias="expiresIn")

    model_config = {"populate_by_name": True}


class RefreshTokenRequest(BaseModel):
    """Schema for token refresh request"""

    refresh_token: str


class UserResponse(BaseModel):
    """Schema for user response (public data)"""

    id: UUID
    email: str
    name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AuthErrorResponse(BaseModel):
    """Schema for authentication error response"""

    detail: str
    error_code: Optional[str] = None
