from pydantic import BaseModel, Field

class GithubConnectionRequest(BaseModel):
    repo_url: str = Field(..., description="URL of the GitHub repository")
    access_token: str | None = Field(None, description="GitHub access token for authentication")

class ConnectionResponse(BaseModel):
    status: str = Field(..., description="Status of the connection (e.g., success, failed)")
    message: str = Field(..., description="Message providing additional information about the connection status")

class JiraConnectionRequest(BaseModel):
    jira_url: str = Field(..., description="URL of the Jira instance")
    username: str = Field(..., description="Username for Jira authentication")
    api_token: str = Field(..., description="API token for Jira authentication")
