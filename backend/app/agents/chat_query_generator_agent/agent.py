# Third-party imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext

# Local application imports
from ..prompt_manager import PromptManager


def before_agent_callback(callback_context: CallbackContext):
    """
    Callback function to save the refined query text into session state['query'].
    This function runs before the agent's main logic and ensures the query is
    extracted from the user content or state and stored in the session state.
    """
    query = callback_context.state.get("query", None)

    if query is None:
        query = (
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "N/A"
        )

    callback_context.state["query"] = query
    return None

def get_chat_query_generator_agent():

    # Define the chat query generator agent
    chat_query_generator_agent = LlmAgent(
        name="chat_query_generator_agent",
        instruction=PromptManager.get_prompt("chat_query_generator_agent"),
        description="Generates a refined query based on the user's input.",
        model="gemini-2.0-flash", # otherwise to define other models use LiteLLm
        before_agent_callback=before_agent_callback,
        output_key="refined_query",
    )

    return chat_query_generator_agent
