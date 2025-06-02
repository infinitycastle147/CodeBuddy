import os
from google.adk.agents import SequentialAgent
from dotenv import load_dotenv
from .information_retrieval_agent import information_retrieval_agent
from .diagram_generation_agent import diagram_generation_agent
from .diagram_query_generator import diagram_query_generator_agent
from .prompt_manager import PromptManager
from google.adk.agents.callback_context import CallbackContext 
from google.genai.types import Content

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

# --- Define the callback function ---
def save_user_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the user's initial query text into session state['query'].
    Runs before the agent's main logic.
    """
    print(f"[Callback] Running before_agent_callback for {callback_context.agent_name}")
    # Access the initial user input from this invocation
    initial_user_content: Content = callback_context.user_content

    user_query_text = "N/A" # Default value

    # Extract text from the user content parts
    if initial_user_content and initial_user_content.parts:
         # Assuming the main query is in the first text part
         for part in initial_user_content.parts:
             if part.text:
                 user_query_text = part.text
                 break # Stop after finding the first text part

    print(f"[Callback] Saving user query '{user_query_text}' to state['query']")
    # Save the extracted text into the session state
    callback_context.state['query'] = user_query_text

    # Return None to allow the agent's normal execution to proceed [15, 17]
    return None

# root_agent =  information_retrieval_agent
# --- Define the diagram agent ---

diagram_agent =  SequentialAgent(
    name="diagram_agent",
    # model="gemini-2.0-flash",
    sub_agents=[diagram_query_generator_agent,information_retrieval_agent,diagram_generation_agent],
    description="This agent is responsible for generating diagrams based on user queries and information retrieval results.",
    # before_agent_callback=save_user_query_to_state,
)

root_agent = diagram_agent
