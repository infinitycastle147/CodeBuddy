# Standard Library Imports
# (No standard library imports in this code)

# Third-Party Imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext

# Local Application Imports
from ..prompt_manager import PromptManager
from ..schemas import DiagramValidationOutput


def save_information_retrieval_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the diagram and instructions into the session state.
    Runs before the agent's main logic.
    """
    # Retrieve the diagram from the callback context state
    diagram = callback_context.state.get("diagram")

    # Save the instructions and diagram into the session state
    callback_context.state["diagram"] = diagram

    # Return None to allow the agent's normal execution to proceed
    return None


# Define the diagram checker agent factory function
def get_diagram_checker_agent():
    """Create and return a new diagram checker agent instance."""
    return LlmAgent(
        name="diagram_checker_agent",
        instruction=PromptManager.get_prompt("diagram_checker_agent"),
        description="Handles user requests related to diagram checking and provides appropriate responses.",
        model="gemini-2.0-flash",
        output_schema=DiagramValidationOutput,
        output_key="diagram_validation_result",
        before_agent_callback=save_information_retrieval_query_to_state,
    )
