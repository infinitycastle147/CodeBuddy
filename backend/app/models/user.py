from pydantic import EmailStr, Field, BaseModel
from .base import BaseModelWithId

class User(BaseModelWithId):
    email: EmailStr = Field(..., description="The user's email address")
    username: str = Field(..., description="The user's username")
    password: str = Field(..., min_length=8, description="The user's password")
