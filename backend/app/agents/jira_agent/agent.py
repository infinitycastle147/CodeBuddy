import os
from google.adk.agents import LlmAgent
from dotenv import load_dotenv
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

jira_connector_agent = LlmAgent(
    name="jira_connector_agent",
    instruction="Integrate with Jira API for ticket linking and updates.",
    model="gemini-2.0-pro",
    # api_key=API_KEY,
)