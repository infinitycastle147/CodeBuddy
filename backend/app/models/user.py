from pydantic import EmailStr, Field, ConfigDict
from typing import Optional, List, Any
from .base import BaseModelWithId
from datetime import datetime


class User(BaseModelWithId):
    """Core User model for database operations with flexible field handling"""

    email: EmailStr = Field(..., description="The user's email address")
    username: str = Field(..., description="The user's username")
    password: Optional[str] = Field(
        None, min_length=8, description="The user's password (optional for OAuth users)"
    )
    name: Optional[str] = Field(None, description="The user's full name")
    image: Optional[str] = Field(None, description="The user's profile image URL")
    provider: Optional[str] = Field(
        None, description="OAuth provider (e.g., 'google', 'github')"
    )
    provider_id: Optional[str] = Field(None, description="OAuth provider user ID")
    email_verified: Optional[datetime] = Field(
        None, description="Email verification timestamp", alias="emailVerified"
    )
    is_verified: Optional[bool] = Field(
        None, description="Whether email is verified", alias="isVerified"
    )
    is_active: bool = Field(
        True, description="Whether the user account is active", alias="isActive"
    )
    accounts: Optional[List[Any]] = Field(
        None, description="OAuth accounts associated with user"
    )

    # MongoDB version field
    version: Optional[int] = Field(None, alias="__v")

    # Override config to allow extra fields from database
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
        extra="ignore",  # Ignore extra fields instead of forbidding them
        json_encoders={datetime: lambda v: v.isoformat()},
    )
