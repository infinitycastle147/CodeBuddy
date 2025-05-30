import os
from google.adk.agents import LlmAgent
from ..vector_search_tool import search_similar_code_chunks
from ..prompt_manager import PromptManager



def get_information_retrieval_agent(query: str):
    """
    Runs the Google ADK github agent workflow on the provided user input.
    """
    try:
        # jira_tools = MCPToolset(
        #     connection_params=StdioServerParameters(
        #         command="docker",
        #         args=[
        #             "run",
        #             "-i",
        #             "--rm",
        #             "-e",
        #             "JIRA_URL",
        #             "-e",
        #             "JIRA_USERNAME",
        #             "-e",
        #             "JIRA_API_TOKEN",
        #             "ghcr.io/sooperset/mcp-atlassian:latest",
        #         ],
        #         env={
        #             "ENABLED_TOOLS": os.getenv("ENABLED_TOOLS"),
        #             "JIRA_URL": os.getenv("JIRA_URL"),
        #             "JIRA_USERNAME": os.getenv("JIRA_USERNAME"),
        #             "JIRA_API_TOKEN": os.getenv("JIRA_API_TOKEN"),
        #         },
        #     )
        # )

        # github_tools = MCPToolset(
        #     connection_params=StdioServerParameters(
        #         command="docker",
        #         args=[
        #             "run",
        #             "-i",
        #             "--rm",
        #             "-e",
        #             "GITHUB_PERSONAL_ACCESS_TOKEN",
        #             "ghcr.io/github/github-mcp-server",
        #         ],
        #         env={
        #             "GITHUB_PERSONAL_ACCESS_TOKEN": os.getenv(
        #                 "GITHUB_PERSONAL_ACCESS_TOKEN"
        #             )
        #         },
        #     )
        # )
        
        information_retrieval_prompt = PromptManager.get_prompt("information_retrieval_agent").replace("{{query}}", query)

        information_retrieval_agent = LlmAgent(
            name="information_retrieval_agent",
            instruction=information_retrieval_prompt,
            description="This agent is responsible for handling the user's request and returning the appropriate response.",
            model="gemini-2.0-flash",
            # tools=[jira_tools, github_tools, search_similar_code_chunks],
            tools=[search_similar_code_chunks],
            output_key="raw_search_results",
        )

        return information_retrieval_agent
    except Exception as e:
        print(f"Error: {e}")
        return None
