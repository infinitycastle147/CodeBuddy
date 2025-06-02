from google.adk.agents import LlmAgent
from ..prompt_manager import PromptManager
from google.adk.agents.callback_context import CallbackContext
from ..constants import MERMAID_INSTRUCTIONS, GENERAL_INSTRUCTIONS

# --- 
def save_information_retrieval_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the information retrieval query into session state.
    Runs before the agent's main logic.
    """
    print("\n\n\n\n\n\n\n\n\n\n\n\n\n", "[Callback] Running before_agent_callback for diagram generation agent", "\n\n\n\n\n\n\n\n")
    # Access the query from the callback context
    info = callback_context.state.get('information')
    
    callback_context.state['SPECIFIC_INSTRUCTIONS'] = MERMAID_INSTRUCTIONS
    callback_context.state['GENERAL_INSTRUCTIONS'] = GENERAL_INSTRUCTIONS
    # Save the query into the session state
    callback_context.state['information'] = info
    
    # Return None to allow the agent's normal execution to proceed
    return None
    
    

diagram_generation_agent = LlmAgent(
    name="diagram_generation_agent",
    instruction=PromptManager.get_prompt("diagram_generation_agent"),
    description="This agent is responsible for handling the user's request and returning the appropriate response.",
    model="gemini-2.0-flash",
    output_key="diagram",
    before_agent_callback=save_information_retrieval_query_to_state,
    # disallow_transfer_to_peers = True,
)
