import os
from google.adk.agents import LlmAgent
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

role_detection_agent = LlmAgent(
    name="role_detection_agent",
    instruction="Detect the user's role based on usage context.",
    model="gemini-2.0-pro",
    # api_key=API_KEY,
)