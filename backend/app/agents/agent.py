import os
from dotenv import load_dotenv
from google.adk.agents import SequentialAgent
from .information_retrieval_agent import get_information_retrieval_agent
from .diagram_generation_agent import diagram_generation_agent
from .diagram_query_generator import diagram_query_generator_agent
from .response_formatter import response_formatter_agent
from .diagram_checker_agent import diagram_checker_agent

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

# --- Define the diagram agent ---
diagram_agent = SequentialAgent(
    name="diagram_agent",
    sub_agents=[
        diagram_query_generator_agent,
        get_information_retrieval_agent(),
        diagram_generation_agent,
        diagram_checker_agent
    ],
    description="This agent is responsible for generating diagrams based on user queries and information retrieval results.",
)

# -- Define the chat agent
chat_agent = SequentialAgent(
    name="chat_agent",
    sub_agents=[
        get_information_retrieval_agent(),
        response_formatter_agent,
    ],
    description="This agent is responsible for handling the user's request and returning the appropriate response.",
)
