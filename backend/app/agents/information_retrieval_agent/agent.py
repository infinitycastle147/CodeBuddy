# --- Standard Library Imports ---
import os

# --- Third-Party Imports ---
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
from google.adk.agents.callback_context import CallbackContext
from loguru import logger

# --- Local Application Imports ---
from app.utils.reranker import search_and_rerank_code_chunks
from ..prompt_manager import PromptManager
from app.agents.agent_errors import AgentOperationError
from app.dto.connection_dto import BaseMCPConnectionRequest


# --- Callback Functions ---
def save_user_query_to_state(callback_context: CallbackContext):
    """
    Callback to save the user's initial query text into session state['query'].
    Runs before the agent's main logic.
    """
    print(
        f"[Callback] Running save_user_query_to_state for {callback_context.agent_name}"
    )
    refined_query = callback_context.state.get("refined_query", None)
    callback_context.state["refined_query"] = refined_query

    # Return None to allow the agent's normal execution to proceed
    return None


def create_callback_with_mcp_connection(mcp_connection: BaseMCPConnectionRequest | None = None):
    """
    Factory function to create a callback with MCP connection parameters.
    """
    def save_refined_query_to_state(callback_context: CallbackContext):
        """
        Callback to save the refined query text and MCP connection info into session state.
        Runs before the agent's main logic.
        """
        refined_query = callback_context.state.get("refined_query", None)
        user_id = callback_context.state.get("user_id", None)
        repo_url = callback_context.state.get("repo_url", None)

        logger.debug(
            f"[Callback] Running save_refined_query_to_state for {callback_context.agent_name}"
        )
        logger.debug(
            f"[Callback] Current state: refined_query={refined_query}, user_id={user_id}, repo_url={repo_url}"
        )

        if refined_query is None:
            logger.debug("[Callback] No refined query found in state, checking user content...")
            
            # Safely access user_content.parts
            user_content = getattr(callback_context, "user_content", None)
            parts = getattr(user_content, "parts", []) if user_content else []
            
            refined_query = (
                parts[0].text
                if parts and hasattr(parts[0], "text")
                else "N/A"
            )

        # Store all relevant information in state
        callback_context.state["refined_query"] = refined_query
        callback_context.state["user_id"] = user_id
        callback_context.state["repo_url"] = repo_url
        
        # Store MCP connection info for template variables
        if mcp_connection:
            callback_context.state["github_username"] = mcp_connection.github_username or "N/A"
            callback_context.state["jira_project_name"] = mcp_connection.jira_project_name or "N/A"
            callback_context.state["jira_url"] = mcp_connection.jira_url or "N/A"
        else:
            callback_context.state["github_username"] = "N/A"
            callback_context.state["jira_project_name"] = "N/A"
            callback_context.state["jira_url"] = "N/A"

        logger.info(f"[Callback] Saved query '{refined_query}' and filters (user_id={user_id}, repo_url={repo_url}) to state")

        # Return None to allow the agent's normal execution to proceed
        return None
    
    return save_refined_query_to_state


# --- Agent Definition ---
def get_information_retrieval_agent(mcp_connection: BaseMCPConnectionRequest | None = None):
    """
    Creates and returns an information retrieval agent that can search for code chunks
    similar to a user query. The agent can filter results by user_id and repo_url.
    Uses MCP connection parameters for GitHub and Jira tool authentication.
    """
    try:
        # Configure Jira tools if connection parameters are provided
        jira_tools = None
        if mcp_connection and mcp_connection.jira_url and mcp_connection.jira_username and mcp_connection.jira_apiToken:
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
                        "ENABLED_TOOLS": os.getenv("ENABLED_TOOLS", "jira-issues,jira-projects"),
                        "JIRA_URL": mcp_connection.jira_url,
                        "JIRA_USERNAME": mcp_connection.jira_username,
                        "JIRA_API_TOKEN": mcp_connection.jira_apiToken,
                    },
                )
            )

        # Configure GitHub tools if connection parameters are provided
        github_tools = None
        if mcp_connection and mcp_connection.github_token:
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
                        "GITHUB_PERSONAL_ACCESS_TOKEN": mcp_connection.github_token
                    },
                )
            )

        # Retrieve the prompt for the agent
        information_retrieval_prompt = PromptManager.get_prompt(
            "information_retrieval_agent"
        )

        # Build tools list based on available connections
        tools = [search_and_rerank_code_chunks]
        if jira_tools:
            tools.append(jira_tools)
        if github_tools:
            tools.append(github_tools)

        # Create the Information Retrieval Agent
        information_retrieval_agent = LlmAgent(
            name="information_retrieval_agent",
            instruction=information_retrieval_prompt,
            description="Handles user requests and returns appropriate responses.",
            model="gemini-2.0-flash",
            tools=tools,
            output_key="information",
            before_agent_callback=create_callback_with_mcp_connection(mcp_connection),
        )

        return information_retrieval_agent
    except Exception as e:
        logger.error(f"Error initializing information retrieval agent: {e}")
        raise AgentOperationError("Failed to initialize information retrieval agent", e)
