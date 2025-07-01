"""
This module contains the agents responsible for handling the user's request and returning the appropriate response.
"""

# --- Third-Party Imports ---
from app.dto.diagram_dto import DiagramRequest
from google.adk.agents import SequentialAgent

# --- Local Application Imports ---
from .information_retrieval_agent import get_information_retrieval_agent
from .diagram_generation_agent import get_diagram_generation_agent
from .diagram_query_generator_agent import get_diagram_query_generator_agent
from .response_formatter_agent import response_formatter_agent
from .diagram_checker_agent import diagram_checker_agent
from .chat_query_generator_agent import chat_query_generator_agent
from .security_checker_agent import get_security_checker_agent
from app.dto.connection_dto import BaseMCPConnectionRequest


def get_diagram_agent(request: DiagramRequest):
    """
    Creates and returns a diagram agent with type-specific diagram generation capabilities.
    
    This function creates a sequential agent workflow that:
    1. Validates security and input safety
    2. Generates refined queries for information retrieval
    3. Retrieves relevant information from connected sources (GitHub/Jira)
    4. Generates type-specific diagrams using the validated diagram type
    5. Validates and checks the generated diagram syntax
    
    Args:
        request (DiagramRequest): Contains user input, diagram type, and MCP connection details
        
    Returns:
        SequentialAgent: Configured agent pipeline for diagram generation
    """
    # Extract diagram type for type-specific generation
    diagram_type = request.type

    # Build MCP connection configuration from request
    mcp_connection = BaseMCPConnectionRequest(
        github_username=request.github_username,
        github_token=request.github_token,
        jira_username=request.jira_username,
        jira_apiToken=request.jira_apiToken,
        jira_project_name=request.jira_project_name,
        jira_url=request.jira_url,
    )

    return SequentialAgent(
        name="diagram_agent",
        sub_agents=[
            get_security_checker_agent(),                    # Security validation
            get_diagram_query_generator_agent(),             # Query refinement  
            get_information_retrieval_agent(mcp_connection), # Information gathering
            get_diagram_generation_agent(diagram_type),      # Type-specific diagram generation
            diagram_checker_agent,                           # Diagram validation
        ],
        description="Sequential agent pipeline for generating type-specific diagrams with information retrieval and validation.",
    )


def get_chat_agent(mcp_connection: BaseMCPConnectionRequest | None = None):
    """
    Creates and returns a chat agent with optional MCP connection parameters.
    """
    return SequentialAgent(
        name="chat_agent",
        sub_agents=[
            get_security_checker_agent(),
            chat_query_generator_agent,
            get_information_retrieval_agent(mcp_connection),
            response_formatter_agent,
        ],
        description="This agent is responsible for handling the user's request and returning the appropriate response.",
    )
