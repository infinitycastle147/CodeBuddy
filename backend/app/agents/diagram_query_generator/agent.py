from google.adk.agents import LlmAgent
from ..prompt_manager import PromptManager

diagram_query_generator_agent = LlmAgent(
    name="diagram_query_generator_agent",
    instruction=PromptManager.get_prompt("diagram_query_generator"),
    description="This agent is responsible for generating a structured query for an information retrieval agent.",
    model="gemini-2.0-flash",
    output_key="diagram_query_generator_results",
)
