# Standard Library Imports
# (No standard library imports in this file)

# Third-Party Imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.genai.types import Content

# Local Application Imports
from ..prompt_manager import PromptManager

def save_user_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the user's initial query text into session state['query'].
    This function runs before the agent's main logic and extracts the user's query
    from the callback context, saving it into the session state.
    """
    user_query_text = callback_context.state.get("query", None)

    if user_query_text is None:
        print(
            f"[Callback] Running before_agent_callback for {callback_context.agent_name}"
        )

        # Access the initial user input from this invocation
        initial_user_content: Content = callback_context.user_content

        # Extract text from the user content parts
        if initial_user_content and initial_user_content.parts:
            for part in initial_user_content.parts:
                if part.text:
                    user_query_text = part.text
                    break  # Stop after finding the first text part

        print(f"[Callback] Saving user query '{user_query_text}' to state['query']")

    # Save the extracted text into the session state
    callback_context.state["query"] = user_query_text

    # Return None to allow the agent's normal execution to proceed
    return None


def get_diagram_updater_agent(diagram: str):
    """
    Factory function to create a Diagram Updater Agent instance.
    This function takes the initial diagram as an argument and returns
    a configured LlmAgent instance for updating the diagram based on user instructions.
    """

    diagram_updater_agent_prompt = PromptManager.get_prompt("diagram_updater_agent")

    diagram_updater_agent_prompt = diagram_updater_agent_prompt.replace("{{diagram}}", diagram)

    # --- Define the Diagram Updater Agent ---
    diagram_updater_agent = LlmAgent(
        name="diagram_updater_agent",
        instruction=diagram_updater_agent_prompt,
        description="Updates the diagram based on user instructions.",
        model="gemini-2.0-flash",
        before_agent_callback=save_user_query_to_state,
        output_key="updated_diagram",
    )

    # Return the agent instance
    return diagram_updater_agent
