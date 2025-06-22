from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Any
from datetime import datetime


class AccountDto(BaseModel):
    """DTO for OAuth account information"""

    provider: str
    provider_account_id: str
    type: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    expires_at: Optional[int] = None
    token_type: Optional[str] = None
    scope: Optional[str] = None
    id_token: Optional[str] = None


class UserDto(BaseModel):
    """DTO for User data from database with flexible field handling"""

    id: Optional[str] = Field(None, alias="_id")
    email: EmailStr
    username: str
    password: Optional[str] = None
    name: Optional[str] = None
    image: Optional[str] = None
    provider: Optional[str] = None
    provider_id: Optional[str] = None
    email_verified: Optional[datetime] = Field(None, alias="emailVerified")
    is_verified: Optional[bool] = Field(None, alias="isVerified")
    is_active: bool = Field(True, alias="isActive")
    accounts: Optional[List[AccountDto]] = None
    created_at: Optional[datetime] = Field(None, alias="createdAt")
    updated_at: Optional[datetime] = Field(None, alias="updatedAt")

    # MongoDB version field
    version: Optional[int] = Field(None, alias="__v")

    model_config = ConfigDict(
        populate_by_name=True,
        extra="ignore",  # Ignore extra fields instead of forbidding them
        from_attributes=True,
    )


class UserResponseDto(BaseModel):
    """DTO for User response to client"""

    id: str
    email: EmailStr
    username: str
    name: Optional[str] = None
    image: Optional[str] = None
    provider: Optional[str] = None
    email_verified: Optional[datetime] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class UserCreateDto(BaseModel):
    """DTO for creating a new user"""

    email: EmailStr
    username: str
    password: Optional[str] = None
    name: Optional[str] = None
    image: Optional[str] = None
    provider: Optional[str] = None
    provider_id: Optional[str] = None


class UserUpdateDto(BaseModel):
    """DTO for updating user information"""

    email: Optional[EmailStr] = None
    username: Optional[str] = None
    name: Optional[str] = None
    image: Optional[str] = None
    is_active: Optional[bool] = None
