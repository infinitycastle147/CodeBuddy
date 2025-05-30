from google.adk.agents import LlmAgent
from ..prompt_manager import PromptManager

response_formatter_agent = LlmAgent(
    name="response_formatter_agent",
    instruction=PromptManager.get_prompt("response_formatter_agent"),
    description="This agent is responsible for handling the user's request and returning the appropriate response.",
    model="gemini-2.0-flash",
    output_key="formatted_response",
)


