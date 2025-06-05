from google.adk.agents import LlmAgent
from ..prompt_manager import PromptManager
from google.adk.agents.callback_context import CallbackContext
from ..constants import MERMAID_INSTRUCTIONS
from google.adk.models.lite_llm import LiteLlm


# ---
def save_information_retrieval_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the information retrieval query into session state.
    Runs before the agent's main logic.
    """
    # Access the query from the callback context
    diagram = callback_context.state.get("diagram")

    callback_context.state["MERMAID_INSTRUCTIONS"] = MERMAID_INSTRUCTIONS
    # Save the query into the session state
    callback_context.state["diagram"] = diagram

    # Return None to allow the agent's normal execution to proceed
    return None


diagram_checker_agent = LlmAgent(
    name="diagram_checker_agent",
    instruction=PromptManager.get_prompt("diagram_checker_agent"),
    description="This agent is responsible for handling the user's request and returning the appropriate response.",
    model=LiteLlm(model="openai/gpt-3.5-turbo"),
    before_agent_callback=save_information_retrieval_query_to_state,
)
