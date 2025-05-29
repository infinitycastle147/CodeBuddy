import os
from google.adk.agents import Agent
from dotenv import load_dotenv
from .vector_search_tool import search_similar_code_chunks
from .prompt_manager import PromptManager
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
from pydantic import BaseModel

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")


class RootAgentRequest(BaseModel):
    user_input: str


def get_github_agent():
    tools = MCPToolset(
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

    print("Tools are ready!")

    return Agent(
        name="github_agent",
        instruction=PromptManager.get_prompt("github_agent"),
        model="gemini-2.0-flash",
        tools=[tools],
    )


def get_jira_agent():
    tools = MCPToolset(
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

    print("Tools are ready!")

    return Agent(
        name="jira_agent",
        instruction=PromptManager.get_prompt("jira_agent"),
        model="gemini-2.0-flash",
        tools=[tools],
    )


def get_agent(request: RootAgentRequest):
    """
    Runs the Google ADK github agent workflow on the provided user input.
    """
    try:
        github_agent = get_github_agent()
        jira_agent = get_jira_agent()

        chat_agent = Agent(
            name="chat_agent",
            instruction=PromptManager.get_prompt("chat_agent"),
            description="This agent is responsible for handling the user's request and returning the appropriate response.",
            model="gemini-2.0-flash",
            sub_agents=[github_agent, jira_agent],
            tools=[search_similar_code_chunks]
        )

        return chat_agent
    except Exception as e:
        print(f"Error: {e}")
        return None
