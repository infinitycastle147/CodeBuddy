# Standard Library Imports
# (No standard library imports in this file)

# Third-Party Imports
from app.constants.diagram_types import DiagramType
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext

# Local Application Imports
from ..prompt_manager import PromptManager


def save_information_retrieval_query_to_state(callback_context: CallbackContext):
    """
    Callback to save user query and retrieved information into session state for diagram generation.
    
    This function extracts the user's original query and information retrieved by previous agents,
    making them available as {{user_query}} and {{information}} placeholders in diagram prompts.
    
    Args:
        callback_context (CallbackContext): Contains session state and user content
        
    Returns:
        None: Allows normal agent execution to proceed
    """
    # Retrieve user query from the callback context state
    user_query = callback_context.state.get("query")

    if user_query is None:
        user_query = (
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "N/A"
        )

    # Retrieve the information from the callback context state
    info = callback_context.state.get("information")

    # Save general instructions and information into the session state
    callback_context.state["information"] = info
    # Save user query into the session state
    callback_context.state["user_query"] = user_query

    # Return None to allow the agent's normal execution to proceed
    return None


def get_diagram_generation_agent(diagram_type: str):
    """
    Creates and returns a type-specific diagram generation agent.

    This agent uses type-specific prompts with context placeholders for user queries
    and retrieved information to generate accurate Mermaid diagrams.

    Args:
        diagram_type (str): Validated diagram type (e.g., "flowchart", "sequence", "class")

    Returns:
        LlmAgent: Configured agent with type-specific prompt and context injection
    """

    diagram_generation_prompt = PromptManager.get_diagram_prompt_safe(
        diagram_type=DiagramType.from_string(diagram_type)
    )

    # Define the diagram generation agent
    diagram_generation_agent = LlmAgent(
        name="diagram_generation_agent",
        instruction=diagram_generation_prompt,
        description="Handles user requests and generates appropriate diagram responses.",
        model="gemini-2.0-flash",
        output_key="diagram",
        before_agent_callback=save_information_retrieval_query_to_state,
    )

    return diagram_generation_agent
