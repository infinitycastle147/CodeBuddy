import os
from google.adk.agents import LlmAgent
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

summarization_agent = LlmAgent(
    name="summarization_agent",
    instruction="Summarize relevant code tailored to the detected role.",
    model="gemini-2.0-pro",
    # api_key=API_KEY,
)
