from pydantic import EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from app.models import BaseModelWithId


class UserResponseDto(BaseModelWithId):
    """DTO for User response to client"""

    email: EmailStr
    username: str
    name: Optional[str] = None
    image: Optional[str] = None
    provider: Optional[str] = None
    email_verified: Optional[datetime] = None
    is_active: bool = True

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
