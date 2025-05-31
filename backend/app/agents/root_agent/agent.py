import os
from google.adk.agents import SequentialAgent, Agent
from dotenv import load_dotenv
from .vector_search_tool import search_similar_code_chunks
from .prompt_manager import PromptManager
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")


def get_chat_agent(query: str):
    """
    This agent is responsible for handling the user's request and returning the appropriate response.
    """ 

    try:
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

        chat_agent_prompt = PromptManager.get_prompt("chat_agent").replace(
            "{{query}}", query
        )

        chat_agent = Agent(
            name="chat_agent",
            instruction=chat_agent_prompt,
            description="This agent is responsible for handling the user's request and returning the appropriate response.",
            model="gemini-2.0-flash",
            tools=[github_tools, jira_tools, search_similar_code_chunks],
            output_key="raw_search_results",
        )

        response_formatter_agent_prompt = PromptManager.get_prompt("response_formatter_agent")

        response_formatter_agent = Agent(
            name="response_formatter_agent",
            instruction=response_formatter_agent_prompt,
            description="This agent is responsible for formatting the response from the chat agent.",
            model="gemini-2.0-flash",
            output_key="formatted_search_results",
        )

        root_agent = SequentialAgent(
            name="root_agent",
            sub_agents=[chat_agent, response_formatter_agent],
        )

        return root_agent

        # return chat_agent
    except Exception as e:
        print(f"Error: {e}")
        return None

