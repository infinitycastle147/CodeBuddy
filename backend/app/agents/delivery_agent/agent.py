import os
from google.adk.agents import LlmAgent
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

delivery_agent = LlmAgent(
    name="delivery_agent",
    instruction="Assemble all outputs into a multimodal response.",
    model="gemini-2.0-pro",
    # api_key=API_KEY,
)