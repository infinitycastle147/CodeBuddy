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

class BaseMCPConnectionRequest(BaseModel):
    github_username: str = Field(..., description="GitHub username for MCP tool authentication")
    github_token: str = Field(..., description="GitHub personal access token for MCP tool operations")
    jira_username: str | None = Field(None, description="Jira username for MCP tool authentication (optional)")
    jira_apiToken: str | None = Field(None, description="Jira API token for MCP tool operations (optional)")
    jira_project_name: str | None = Field(None, description="Jira project name for MCP tool operations (optional)")
    jira_url: str | None = Field(None, description="Jira instance URL for MCP tool operations (optional)")

