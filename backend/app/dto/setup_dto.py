from typing import Optional
from pydantic import BaseModel, Field

class RepoRequest(BaseModel):
    repo_url: str = Field(..., description="URL of the GitHub repository")
    access_token: Optional[str] = Field(None, description="GitHub access token for authentication")
