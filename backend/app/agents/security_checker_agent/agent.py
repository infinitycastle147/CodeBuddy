# Third-Party Imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext

# Local Application Imports
from ..prompt_manager import PromptManager


def before_agent_callback(callback_context: CallbackContext):
    """
    Callback function to save the refined query text into the session state['query'].
    This function executes before the agent's main logic.
    """
    query = callback_context.state.get("query")

    if query is None:
        query = (
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "N/A"
        )

    callback_context.state["query"] = query

    # Returning None allows the agent's normal execution to proceed
    return None


def get_security_checker_agent():
    """Creates and configures the Security Checker Agent with the required callbacks."""

    security_checker_agent = LlmAgent(
        name="security_checker_agent",
        instruction=PromptManager.get_prompt("security_checker_agent"),
        description="Agent responsible for validating the security of user queries.",
        model="gemini-2.0-flash",
        before_agent_callback=before_agent_callback,
        output_key="query",
    )
    return security_checker_agent
