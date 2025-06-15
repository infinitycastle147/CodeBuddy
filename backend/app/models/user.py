from pydantic import EmailStr, Field, BaseModel
from typing import Optional
from .base import BaseModelWithId
from datetime import datetime

class User(BaseModelWithId):
    email: EmailStr = Field(..., description="The user's email address")
    username: str = Field(..., description="The user's username")
    password: str = Field(..., min_length=8, description="The user's password")

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    username: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
