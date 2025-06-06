# Standard Library Imports
# (No standard library imports in this code)

# Third-Party Imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.lite_llm import LiteLlm

# Local Application Imports
from ..prompt_manager import PromptManager


def save_refined_query_to_state(callback_context: CallbackContext):
    """
    Callback function to save the refined query text into the session state['query'].
    This function executes before the agent's main logic.
    """
    query = callback_context.state.get("query")

    if query is None:
        print(
            "[Callback] No refined query found in state. Checking user content...",
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "N/A",
        )
        query = (
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "N/A"
        )

    callback_context.state["query"] = query

    print(f"[Callback] Saved refined query '{query}' to state['query']")

    # Returning None allows the agent's normal execution to proceed
    return None


# Define the security checker agent
security_checker_agent = LlmAgent(
    name="security_checker_agent",
    instruction=PromptManager.get_prompt("security_checker_agent"),
    description="Agent responsible for validating the security of user queries.",
    model=LiteLlm(model="openai/gpt-3.5-turbo"),
    before_agent_callback=save_refined_query_to_state,
    output_key="query",
)
