from typing import Optional
from pydantic import BaseModel, Field


class BaseMCPConnectionRequest(BaseModel):
    github_username: str = Field(..., description="GitHub username for MCP tool authentication")
    github_token: str = Field(..., description="GitHub personal access token for MCP tool operations")
    repo_url: str = Field(..., description="GitHub repository URL for filtering search results")
    jira_username: Optional[str] = Field(None, description="Jira username for MCP tool authentication (optional)")
    jira_apiToken: Optional[str] = Field(None, description="Jira API token for MCP tool operations (optional)")
    jira_project_name: Optional[str] = Field(None, description="Jira project name for MCP tool operations (optional)")
    jira_url: Optional[str] = Field(None, description="Jira instance URL for MCP tool operations (optional)")


class GithubConnectionRequest(BaseModel):
    github_username: str = Field(..., description="GitHub username")
    github_token: str = Field(..., description="GitHub personal access token")
    repo_url: str = Field(..., description="GitHub repository URL")


class JiraConnectionRequest(BaseModel):
    jira_username: str = Field(..., description="Jira username")
    jira_apiToken: str = Field(..., description="Jira API token")
    jira_project_name: str = Field(..., description="Jira project name")
    jira_url: str = Field(..., description="Jira instance URL")


class ConnectionResponse(BaseModel):
    success: bool = Field(..., description="Whether the connection was successful")
    message: str = Field(..., description="Response message")

