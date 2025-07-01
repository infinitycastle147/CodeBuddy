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


def get_diagram_query_generator_agent():
    """
    Creates and returns a diagram query generator agent with user query state management.
    
    This agent refines user input into structured queries for information retrieval
    and preserves the original user query in session state for downstream agents.
    
    Returns:
        LlmAgent: Configured agent for query generation with callback for state management
    """

    # Define the diagram query generator agent
    diagram_query_generator_agent = LlmAgent(
        name="diagram_query_generator_agent",
        instruction=PromptManager.get_prompt("diagram_query_generator"),
        description="Generates a structured query for an information retrieval agent.",
        model="gemini-2.0-flash",
        before_agent_callback=save_user_query_to_state,
        output_key="refined_query",
    )

    return diagram_query_generator_agent
