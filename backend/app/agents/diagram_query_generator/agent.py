from google.adk.agents import LlmAgent
from ..prompt_manager import PromptManager
from google.adk.agents.callback_context import CallbackContext
from google.genai.types import Content
from google.adk.models.lite_llm import LiteLlm


def save_user_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the user's initial query text into session state['query'].
    Runs before the agent's main logic.
    """
    print(f"[Callback] Running before_agent_callback for {callback_context.agent_name}")
    # Access the initial user input from this invocation
    initial_user_content: Content = callback_context.user_content

    user_query_text = "N/A"  # Default value

    # Extract text from the user content parts
    if initial_user_content and initial_user_content.parts:
        # Assuming the main query is in the first text part
        for part in initial_user_content.parts:
            if part.text:
                user_query_text = part.text
                break  # Stop after finding the first text part

    print(f"[Callback] Saving user query '{user_query_text}' to state['query']")
    # Save the extracted text into the session state
    callback_context.state["query"] = user_query_text

    # Return None to allow the agent's normal execution to proceed [15, 17]
    return None


diagram_query_generator_agent = LlmAgent(
    name="diagram_query_generator_agent",
    instruction=PromptManager.get_prompt("diagram_query_generator"),
    description="This agent is responsible for generating a structured query for an information retrieval agent.",
    model=LiteLlm(model="openai/gpt-3.5-turbo"),
    before_agent_callback=save_user_query_to_state,
    # disallow_transfer_to_peers = True,
    output_key="refined_query",
)
