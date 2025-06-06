from google.adk.agents import LlmAgent
from ..prompt_manager import PromptManager
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.lite_llm import LiteLlm


def save_refined_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the refined query text into session state['refined_query'].
    Runs before the agent's main logic.
    """

    query = callback_context.state.get("query", None)

    if query is None:
        print(
            "[Callback] No refined query found in state, checking user content...",
            callback_context.user_content.parts[0].text,
        )
        query = (
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "N/A"
        )

    callback_context.state["query"] = query

    print(f"[Callback] Saving refined query '{query}' to state['query']")

    # Return None to allow the agent's normal execution to proceed
    return None


chat_query_generator_agent = LlmAgent(
    name="chat_query_generator_agent",
    instruction=PromptManager.get_prompt("chat_query_generator_agent"),
    description="This agent is responsible for generating a refined query based on the user's input.",
    model=LiteLlm(model="openai/gpt-3.5-turbo"),
    before_agent_callback=save_refined_query_to_state,
    output_key="refined_query",
)
