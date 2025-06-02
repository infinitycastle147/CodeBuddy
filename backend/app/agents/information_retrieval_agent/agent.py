import os   
from google.adk.agents import LlmAgent
from ..vector_search_tool import search_similar_code_chunks
from ..prompt_manager import PromptManager
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
from ..response_formatter.agent import response_formatter_agent
from google.adk.agents.callback_context import CallbackContext 
from google.adk.agents.invocation_context import InvocationContext
from google.genai.types import Content
# from ..diagram_generation_agent.agent import diagram_generation_agent

# --- Define the callback function ---
def save_user_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the user's initial query text into session state['query'].
    Runs before the agent's main logic.
    """
    print(f"[Callback] Running before_agent_callback for {callback_context.agent_name}")
    refined_query = callback_context.state.get('refined_query', None)
    callback_context.state['refined_query'] = refined_query

    # Return None to allow the agent's normal execution to proceed [15, 17]
    return None

# ---
def save_refined_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the refined query text into session state['refined_query'].
    Runs before the agent's main logic.
    """    # Access the refined query from the callback context
    refined_query = callback_context.state.get('refined_query', "N/A")
    print(f"[Callback] Saving refined query '{refined_query}' to state['refined_query']")
    # Save the refined query into the session state
    callback_context.state['refined_query'] = refined_query

    # Return None to allow the agent's normal execution to proceed
    return None

def get_information_retrieval_agent():
    """
    Runs the Google ADK github agent workflow on the provided user input.
    """
    try:
        jira_tools = MCPToolset(
            connection_params=StdioServerParameters(
                command="docker",
                args=[
                    "run",
                    "-i",
                    "--rm",
                    "-e",
                    "JIRA_URL",
                    "-e",
                    "JIRA_USERNAME",
                    "-e",
                    "JIRA_API_TOKEN",
                    "ghcr.io/sooperset/mcp-atlassian:latest",
                ],
                env={
                    "ENABLED_TOOLS": os.getenv("ENABLED_TOOLS"),
                    "JIRA_URL": os.getenv("JIRA_URL"),
                    "JIRA_USERNAME": os.getenv("JIRA_USERNAME"),
                    "JIRA_API_TOKEN": os.getenv("JIRA_API_TOKEN"),
                },
            )
        )

        github_tools = MCPToolset(
            connection_params=StdioServerParameters(
                command="docker",
                args=[
                    "run",
                    "-i",
                    "--rm",
                    "-e",
                    "GITHUB_PERSONAL_ACCESS_TOKEN",
                    "ghcr.io/github/github-mcp-server",
                ],
                env={
                    "GITHUB_PERSONAL_ACCESS_TOKEN": os.getenv(
                        "GITHUB_PERSONAL_ACCESS_TOKEN"
                    )
                },
            )
        )
        
        information_retrieval_prompt = PromptManager.get_prompt("information_retrieval_agent")

        information_retrieval_agent = LlmAgent(
            name="information_retrieval_agent",
            instruction=information_retrieval_prompt,
            description="This agent is responsible for handling the user's request and returning the appropriate response.",
            model="gemini-2.0-flash",
            # sub_agents=[response_formatter_agent],
            tools=[jira_tools, github_tools, search_similar_code_chunks],
            # tools=[search_similar_code_chunks],
            # disallow_transfer_to_peers = True,
            output_key="information",
            # before_agent_callback=save_user_query_to_state,
            before_agent_callback=save_refined_query_to_state,
        )

        return information_retrieval_agent
    except Exception as e:
        print(f"Error: {e}")
        return None
    
information_retrieval_agent = get_information_retrieval_agent()
