# --- Standard Library Imports ---
import os
from typing import Optional

# --- Third-Party Imports ---
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
from google.adk.agents.callback_context import CallbackContext
from loguru import logger

# --- Local Application Imports ---
from ..prompt_manager import PromptManager
from app.agents.agent_errors import AgentOperationError
from app.dto.connection_dto import BaseMCPConnectionRequest
from ...utils.embedder import search_similar_code_chunks


def create_callback_with_mcp_connection(
    mcp_connection: Optional[BaseMCPConnectionRequest] = None,
):
    """
    Factory to create a callback that saves refined query text
    and MCP connection details into session state before agent logic runs.
    """

    def _extract_refined_query(ctx: CallbackContext) -> str:
        """Get refined query from state or fall back to user_content."""
        if ctx.state.get("refined_query"):
            return ctx.state["refined_query"]

        user_content = getattr(ctx, "user_content", None)
        parts = getattr(user_content, "parts", []) if user_content else []
        return getattr(parts[0], "text", "N/A") if parts else "N/A"

    def _get_mcp_state() -> dict[str, str]:
        """Return MCP connection info as a dict with safe defaults."""
        if not mcp_connection:
            return {
                "repo_url": "N/A",
                "github_username": "N/A",
                "jira_project_name": "N/A",
                "jira_url": "N/A",
            }
        return {
            "repo_url": mcp_connection.repo_url or "N/A",
            "github_username": mcp_connection.github_username or "N/A",
            "jira_project_name": mcp_connection.jira_project_name or "N/A",
            "jira_url": mcp_connection.jira_url or "N/A",
        }

    def save_refined_query_to_state(ctx: CallbackContext):
        """
        Save refined query text and MCP connection info into session state.
        Runs before the agent's main logic.
        """
        ctx.state["refined_query"] = _extract_refined_query(ctx)
        ctx.state.update(_get_mcp_state())
        return None  # allow agent execution to proceed

    return save_refined_query_to_state



# --- Agent Definition ---
def get_information_retrieval_agent(
    mcp_connection: BaseMCPConnectionRequest | None = None,
):
    """
    Creates and returns an information retrieval agent that can search for code chunks
    similar to a user query. The agent can filter results by user_id and repo_url.
    Uses MCP connection parameters for GitHub and Jira tool authentication.
    """

    try:
        # Configure Jira tools if connection parameters are provided
        jira_tools = None
        if (
            mcp_connection
            and mcp_connection.jira_url
            and mcp_connection.jira_username
            and mcp_connection.jira_apiToken
        ):
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
                        "ENABLED_TOOLS": os.getenv(
                            "ENABLED_TOOLS", "jira-issues,jira-projects"
                        ),
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
                    env={"GITHUB_PERSONAL_ACCESS_TOKEN": mcp_connection.github_token},
                )
            )

        information_retrieval_prompt = PromptManager.get_prompt("information_retrieval_agent")

        # Build tools list based on available connections
        tools = [search_similar_code_chunks]
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
