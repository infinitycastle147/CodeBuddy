# Standard Library Imports
# (No standard library imports in this file)

# Third-Party Imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.lite_llm import LiteLlm

# Local Application Imports
from ..prompt_manager import PromptManager


def save_refined_query_to_state(callback_context: CallbackContext):
    """
    Callback function to save the refined query text into the session state['information'].
    This function runs before the agent's main logic and ensures that the 'information'
    key in the state is populated with user content if not already present.
    """
    information = callback_context.state.get("information", None)

    if information is None:
        print(
            "[Callback] No 'information' found in state, checking user content...",
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "N/A",
        )
        information = (
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "N/A"
        )

    callback_context.state["information"] = information

    print(f"[Callback] Saved 'information': '{information}' to state['information']")

    # Return None to allow the agent's normal execution to proceed
    return None


# Initialize the response formatter agent
response_formatter_agent = LlmAgent(
    name="response_formatter_agent",
    instruction=PromptManager.get_prompt("response_formatter_agent"),
    description=(
        "Handles the user's request and returns the appropriate response "
        "based on the provided instructions."
    ),
    model=LiteLlm(model="openai/gpt-3.5-turbo"),
    before_agent_callback=save_refined_query_to_state,
)
