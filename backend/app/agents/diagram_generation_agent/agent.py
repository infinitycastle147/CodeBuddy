# Third-Party Imports
from app.constants.diagram_types import DiagramType
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext

# Local Application Imports
from ..prompt_manager import PromptManager


def before_agent_callback(callback_context: CallbackContext):
    """
    Callback to save user query and retrieved information into session state for diagram generation.
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
        before_agent_callback=before_agent_callback,
    )

    return diagram_generation_agent
