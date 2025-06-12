from typing import Optional
from pydantic import BaseModel

class RepoRequest(BaseModel):
    repo_url: str
    access_token: Optional[str] = None