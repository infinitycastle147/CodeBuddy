# Third-Party Imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext

# Local Application Imports
from ..prompt_manager import PromptManager


def before_agent_callback(callback_context: CallbackContext):
    """Callback function to save the refined query text into the session state['query']"""

    query = callback_context.state.get("query", None)

    if query is None:
        query = (
            callback_context.user_content.parts[0].text
            if callback_context.user_content.parts
            else "N/A"
        )

    callback_context.state["query"] = query

    return None


def get_diagram_data_refiner_agent(text: str, diagram_type: str) -> LlmAgent:
    """Creates and configures the Security Checker Agent with the required callbacks."""

    prompt = PromptManager.get_prompt("diagram_data_refiner_agent")

    prompt = prompt.replace("{{raw_text}}", text).replace("{{diagram_type}}", diagram_type)

    diagram_data_refiner_agent = LlmAgent(
        name="diagram_data_refiner_agent",
        instruction=prompt,
        description="Agent responsible for refining and structuring diagram data.",
        model="gemini-2.0-flash",
        before_agent_callback=before_agent_callback,
        output_key="information",
    )
    return diagram_data_refiner_agent
