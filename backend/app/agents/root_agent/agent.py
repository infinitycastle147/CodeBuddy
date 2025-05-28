import os
from google.adk.agents import (
    Agent,
    SequentialAgent,
)
from dotenv import load_dotenv
from .vector_search_tool import search_similar_code_chunks
from .prompt_manager import PromptManager
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
from google.adk.sessions import InMemorySessionService
from pydantic import BaseModel

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

class RootAgentRequest(BaseModel):
    user_input: str

# === 1. Role Detection Agent ===
intent_detection_agent = Agent(
    name="intent_detection_agent",
    instruction=PromptManager.get_prompt("intent_detection_agent"),
    description="This agent is responsible for detecting the intent of the user in the conversation.",
    model="gemini-2.0-flash",
)

# === 2. Intent Detection with RAG ===
information_retrieval_agent = Agent(
    name="information_retrieval_agent",
    instruction=PromptManager.get_prompt("information_retrieval_agent"),
    description="This agent is responsible for retrieving information from the codebase.",
    model="gemini-2.0-flash",
    tools=[search_similar_code_chunks],
)

# === 3. Response Generation ===
response_generator_agent = Agent(
    name="response_generator_agent",
    instruction=PromptManager.get_prompt("response_generator_agent"),
    model="gemini-2.0-flash",
)

# Core workflow for first prototype
chat_agent = SequentialAgent(
    name="chat_agent",
    sub_agents=[
        intent_detection_agent,
        information_retrieval_agent,
        response_generator_agent,
    ],
)


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
                "-e", "JIRA_URL",
                "-e", "JIRA_USERNAME",
                "-e", "JIRA_API_TOKEN",
                "ghcr.io/sooperset/mcp-atlassian:latest"
            ],
            env={
                "ENABLED_TOOLS": os.getenv("ENABLED_TOOLS"),
                "JIRA_URL": os.getenv("JIRA_URL"),
                "JIRA_USERNAME": os.getenv("JIRA_USERNAME"),
                "JIRA_API_TOKEN": os.getenv("JIRA_API_TOKEN")
            }
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
        )

        return chat_agent
    except Exception as e:
        print(f"Error: {e}")
        return None

# Alias for external usage
root_agent = chat_agent
