import os
from google.adk.agents import (
    Agent,
    SequentialAgent,
)
from dotenv import load_dotenv
from .vector_search_tool import search_similar_code_chunks
from .prompt_manager import PromptManager
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

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


# Alias for external usage
root_agent = chat_agent
