"""
This module contains the agents responsible for handling the user's request and returning the appropriate response.
"""

# --- Third-Party Imports ---
from google.adk.agents import SequentialAgent

# --- Local Application Imports ---
from .information_retrieval_agent import get_information_retrieval_agent
from .diagram_generation_agent import diagram_generation_agent
from .diagram_query_generator_agent import diagram_query_generator_agent
from .response_formatter_agent import response_formatter_agent
from .diagram_checker_agent import diagram_checker_agent
from .chat_query_generator_agent import chat_query_generator_agent
from .security_checker_agent import get_security_checker_agent
from app.dto.connection_dto import BaseMCPConnectionRequest

def get_diagram_agent(mcp_connection: BaseMCPConnectionRequest | None = None):
    """
    Creates and returns a diagram agent with optional MCP connection parameters.
    """
    return SequentialAgent(
        name="diagram_agent",
        sub_agents=[
            get_security_checker_agent(),
            diagram_query_generator_agent,
            get_information_retrieval_agent(mcp_connection),
            diagram_generation_agent,
            diagram_checker_agent,
        ],
        description="This agent is responsible for generating diagrams based on user queries and information retrieval results.",
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
