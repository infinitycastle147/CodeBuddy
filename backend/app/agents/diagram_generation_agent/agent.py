# Standard Library Imports
# (No standard library imports in this file)

# Third-Party Imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.lite_llm import LiteLlm

# Local Application Imports
from ..prompt_manager import PromptManager
from ..constants import GENERAL_INSTRUCTIONS


def save_information_retrieval_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the information retrieval query and general instructions into session state.
    This function runs before the agent's main logic.
    """
    # Retrieve the information from the callback context state
    info = callback_context.state.get("information")

    # Save general instructions and information into the session state
    callback_context.state["GENERAL_INSTRUCTIONS"] = GENERAL_INSTRUCTIONS
    callback_context.state["information"] = info

    # Return None to allow the agent's normal execution to proceed
    return None


# Define the diagram generation agent
diagram_generation_agent = LlmAgent(
    name="diagram_generation_agent",
    instruction=PromptManager.get_prompt("diagram_generation_agent"),
    description="Handles user requests and generates appropriate diagram responses.",
    model="gemini-2.0-flash",
    output_key="diagram",
    before_agent_callback=save_information_retrieval_query_to_state,
)
