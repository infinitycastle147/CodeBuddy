# Standard library imports (if any)

# Third-party imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.lite_llm import LiteLlm

# Local application imports
from ..prompt_manager import PromptManager


def save_refined_query_to_state(callback_context: CallbackContext):
    """
    Callback function to save the refined query text into session state['query'].
    This function runs before the agent's main logic and ensures the query is
    extracted from the user content or state and stored in the session state.
    """
    query = callback_context.state.get("query", None)

    if query is None:
        print(
            "[Callback] No query found in state, extracting from user content...",
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "No user content available",
        )
        query = (
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "N/A"
        )

    callback_context.state["query"] = query

    print(f"[Callback] Saved query '{query}' to state['query']")

    # Return None to allow the agent's normal execution to proceed
    return None

# Define the chat query generator agent
chat_query_generator_agent = LlmAgent(
    name="chat_query_generator_agent",
    instruction=PromptManager.get_prompt("chat_query_generator_agent"),
    description="Generates a refined query based on the user's input.",
    model="gemini-2.0-flash", # otherwise to define other models use LiteLLm
    before_agent_callback=save_refined_query_to_state,
    output_key="refined_query",
)
