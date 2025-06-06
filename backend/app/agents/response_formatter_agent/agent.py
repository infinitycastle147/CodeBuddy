from google.adk.agents import LlmAgent
from ..prompt_manager import PromptManager
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.lite_llm import LiteLlm


def save_refined_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the refined query text into session state['refined_query'].
    Runs before the agent's main logic.
    """

    information = callback_context.state.get("information", None)

    if information is None:
        print(
            "[Callback] No refined query found in state, checking user content...",
            callback_context.user_content.parts[0].text,
        )
        information = (
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "N/A"
        )

    callback_context.state["information"] = information

    print(f"[Callback] Saving refined query '{information}' to state['information']")

    # Return None to allow the agent's normal execution to proceed
    return None


response_formatter_agent = LlmAgent(
    name="response_formatter_agent",
    instruction=PromptManager.get_prompt("response_formatter_agent"),
    description="This agent is responsible for handling the user's request and returning the appropriate response.",
    model=LiteLlm(model="openai/gpt-3.5-turbo"),
    before_agent_callback=save_refined_query_to_state,
)
