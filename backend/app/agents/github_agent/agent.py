import os
from google.adk.agents import LlmAgent
from dotenv import load_dotenv
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

async def get_github_fetch_agent():
    tools, exit_stack = await MCPToolset.from_server(
        connection_params=StdioServerParameters(
            command="docker",
            args=[
                "run",
                "-i",
                "--rm",
                "-e",
                "GITHUB_PERSONAL_ACCESS_TOKEN",
                "ghcr.io/github/github-mcp-server"
            ],
            env={
                "GITHUB_PERSONAL_ACCESS_TOKEN": GITHUB_TOKEN
            }
        )
    )

    github_fetch_agent = LlmAgent(
        name="github_fetch_agent",
        instruction="Fetch or pull GitHub repo for the project.",
        model="gemini-2.0-flash",
        tools=tools,
    )

    return github_fetch_agent, exit_stack

async def get_git_connector_agent():
    tools, exit_stack = await MCPToolset.from_server(
        connection_params=StdioServerParameters(
            command="docker",
            args=[
                "run",
                "-i",
                "--rm",
                "-e",
                "GIT_PERSONAL_ACCESS_TOKEN",
                "ghcr.io/github/github-mcp-server"
            ],
            env={
                "GIT_PERSONAL_ACCESS_TOKEN": GITHUB_TOKEN
            }
        )
    )

    git_connector_agent = LlmAgent(
        name="git_connector_agent",
        instruction="Access commit history, diffs, and blame info from Git.",
        model="gemini-2.0-flash",
        tools=tools,
    )

    return git_connector_agent, exit_stack
