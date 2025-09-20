from typing import Optional

# --- Third-Party Imports ---
from google.adk.agents import SequentialAgent

# --- Local Application Imports ---
from .diagram_data_refiner_agent import get_diagram_data_refiner_agent
from .information_retrieval_agent import get_information_retrieval_agent
from .diagram_generation_agent import get_diagram_generation_agent
from .diagram_query_generator_agent import get_diagram_query_generator_agent
from .response_formatter_agent import get_response_formatter_agent
from .diagram_checker_agent import get_diagram_checker_agent
from .chat_query_generator_agent import get_chat_query_generator_agent
from .security_checker_agent import get_security_checker_agent
from app.dto.connection_dto import BaseMCPConnectionRequest
from ..dto import DiagramRequest


def get_repo_diagram_generation_agent(request: DiagramRequest):
    """Creates and returns a diagram agent with type-specific diagram generation capabilities."""

    # Extract diagram type for type-specific generation
    diagram_type = request.type

    # Build MCP connection configuration from request
    mcp_connection = BaseMCPConnectionRequest(
        github_username=request.github_username,
        github_token=request.github_token,
        repo_url=request.repo_url,
        jira_username=request.jira_username,
        jira_apiToken=request.jira_apiToken,
        jira_project_name=request.jira_project_name,
        jira_url=request.jira_url,
    )

    return SequentialAgent(
        name="diagram_agent",
        sub_agents=[
            get_security_checker_agent(),
            get_diagram_query_generator_agent(),
            get_information_retrieval_agent(mcp_connection),
            get_diagram_generation_agent(diagram_type),
            get_diagram_checker_agent(),
        ],
        description="Sequential agent pipeline for generating type-specific diagrams with information retrieval and validation.",
    )


def get_repo_chat_agent(mcp_connection: Optional[BaseMCPConnectionRequest] = None):
    """Creates and returns a chat agent with optional MCP connection parameters."""

    return SequentialAgent(
        name="chat_agent",
        sub_agents=[
            get_security_checker_agent(),
            get_chat_query_generator_agent(),
            get_information_retrieval_agent(mcp_connection),
            get_response_formatter_agent(),
        ],
        description="This agent is responsible for handling the user's request and returning the appropriate response.",
    )

def get_diagram_generation_from_text_agent(text: str, diagram_type: str):
    """Creates and returns a diagram generation agent without MCP connection parameters."""

    return SequentialAgent(
        name="diagram_from_text_agent",
        sub_agents=[
            get_diagram_data_refiner_agent(text, diagram_type),
            get_diagram_generation_agent(diagram_type),
        ],
        description="Agent pipeline for generating type-specific diagrams from text input with validation.",
    )
