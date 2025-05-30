from google.adk.agents import LlmAgent
from ..prompt_manager import PromptManager

diagram_generation_agent = LlmAgent(
    name="diagram_generation_agent",
    instruction=PromptManager.get_prompt("diagram_generation_agent"),
    description="This agent is responsible for handling the user's request and returning the appropriate response.",
    model="gemini-2.0-flash",
    output_key="diagram_generation_results",
)
