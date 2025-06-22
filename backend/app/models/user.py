from pydantic import EmailStr, Field, BaseModel
from typing import Optional
from .base import BaseModelWithId
from datetime import datetime

class User(BaseModelWithId):
    email: EmailStr = Field(..., description="The user's email address")
    username: str = Field(..., description="The user's username")
    password: Optional[str] = Field(None, min_length=8, description="The user's password (optional for OAuth users)")
    name: Optional[str] = Field(None, description="The user's full name")
    image: Optional[str] = Field(None, description="The user's profile image URL")
    provider: Optional[str] = Field(None, description="OAuth provider (e.g., 'google', 'github')")
    provider_id: Optional[str] = Field(None, description="OAuth provider user ID")
    email_verified: Optional[datetime] = Field(None, description="Email verification timestamp")
    is_active: bool = Field(True, description="Whether the user account is active")

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    username: str
    name: Optional[str] = None
    image: Optional[str] = None
    provider: Optional[str] = None
    email_verified: Optional[datetime] = None
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: Optional[str] = None
    name: Optional[str] = None
    image: Optional[str] = None
    provider: Optional[str] = None
    provider_id: Optional[str] = None

class NextAuthUser(BaseModel):
    """User model compatible with NextAuth session"""
    id: str
    email: EmailStr
    name: Optional[str] = None
    image: Optional[str] = None
    username: str
