import os
from google.adk.agents import (
    ParallelAgent,
)
from dotenv import load_dotenv
from app.agents.github_agent import git_connector_agent
from app.agents.jira_agent import jira_connector_agent

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

integration_agents = ParallelAgent(
    name="integration_agents",
    agents=[git_connector_agent, jira_connector_agent],
)
