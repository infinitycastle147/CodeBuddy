# Third-Party Imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.lite_llm import LiteLlm

# Local Application Imports
from ..prompt_manager import PromptManager
from ..schemas import FormattedResponse


def before_agent_callback(callback_context: CallbackContext):
    """Callback function to save the refined query text into the session state['information']."""

    information = callback_context.state.get("information", None)

    callback_context.state["information"] = information

    # Return None to allow the agent's normal execution to proceed
    return None

def get_response_formatter_agent():

    # Initialize the response formatter agent
    response_formatter_agent = LlmAgent(
        name="response_formatter_agent",
        instruction=PromptManager.get_prompt("response_formatter_agent"),
        description=(
            "Handles the user's request and returns the appropriate response "
            "based on the provided instructions."
        ),
        model="gemini-2.0-flash",
        output_schema=FormattedResponse,
        output_key="formatted_chat_response",
        before_agent_callback=before_agent_callback,
    )

    return response_formatter_agent
