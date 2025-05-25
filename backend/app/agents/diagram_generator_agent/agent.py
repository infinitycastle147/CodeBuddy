import os
from google.adk.agents import (
    LlmAgent,
    SequentialAgent,
    ParallelAgent,
)
from dotenv import load_dotenv
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

uml_generator_agent = LlmAgent(
    name="uml_generator_agent",
    instruction="Generate UML diagrams in Mermaid or PlantUML syntax.",
    model="gemini-2.0-pro",
    # api_key=API_KEY,
)

erd_generator_agent = LlmAgent(
    name="erd_generator_agent",
    instruction="Generate ERD diagrams from schema information.",
    model="gemini-2.0-pro",
    # api_key=API_KEY,
)

diagram_generation = ParallelAgent(
    name="diagram_generation",
    sub_agents=[uml_generator_agent, erd_generator_agent],
)