import os
from google.adk.agents import LlmAgent
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

rag_retriever_agent = LlmAgent(
    name="rag_retriever_agent",
    instruction="Retrieve relevant code snippets using vector embeddings.",
    model="gemini-2.0-flash",
    # api_key=API_KEY,
)
