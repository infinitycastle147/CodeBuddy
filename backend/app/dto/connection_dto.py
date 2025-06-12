from pydantic import BaseModel

class GithubConnectionRequest(BaseModel):
    repo_url: str
    access_token: str | None = None

class ConnectionResponse(BaseModel):
    status: str
    message: str

class JiraConnectionRequest(BaseModel):
    jira_url: str
    username: str
    api_token: str