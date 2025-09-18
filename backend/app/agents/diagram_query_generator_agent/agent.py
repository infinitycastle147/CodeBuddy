# Third-Party Imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.genai.types import Content

# Local Application Imports
from ..prompt_manager import PromptManager


def before_agent_callback(callback_context: CallbackContext):
    """Callback to save the user's initial query text into session state['query']."""

    user_query_text = callback_context.state.get("query", None)

    # Save the extracted text into the session state
    callback_context.state["query"] = user_query_text

    # Return None to allow the agent's normal execution to proceed
    return None


def get_diagram_query_generator_agent():
    """
    Creates and returns a diagram query generator agent with user query state management.
    """

    # Define the diagram query generator agent
    diagram_query_generator_agent = LlmAgent(
        name="diagram_query_generator_agent",
        instruction=PromptManager.get_prompt("diagram_query_generator"),
        description="Generates a structured query for an information retrieval agent.",
        model="gemini-2.0-flash",
        before_agent_callback=before_agent_callback,
        output_key="refined_query",
    )

    return diagram_query_generator_agent
