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

