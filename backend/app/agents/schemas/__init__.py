"""
Agent Output Schemas

This module contains Pydantic schemas for structured agent outputs.
These schemas are designed for terminal agents that don't use tools
or transfer control to other agents.

Usage:
    from app.agents.schemas import DiagramValidationOutput, FormattedResponse
    
    # For diagram_checker_agent
    agent = LlmAgent(
        name="diagram_checker_agent",
        output_schema=DiagramValidationOutput,
        ...
    )
    
    # For response_formatter_agent  
    agent = LlmAgent(
        name="response_formatter_agent",
        output_schema=FormattedResponse,
        ...
    )

Note: Using output_schema disables tool usage and agent control transfer.
Only use with terminal agents in sequential flows.
"""

from .diagram_checker_output import DiagramValidationOutput
from .response_formatter_output import FormattedResponse, CodeSnippet, Source

__all__ = [
    "DiagramValidationOutput",
    "FormattedResponse", 
    "CodeSnippet",
    "Source"
]