# --- Third-Party Imports ---
from google.adk.agents import SequentialAgent

# --- Local Application Imports ---
from .information_retrieval_agent import get_information_retrieval_agent
from .diagram_generation_agent import diagram_generation_agent
from .diagram_query_generator_agent import diagram_query_generator_agent
from .response_formatter_agent import response_formatter_agent
from .diagram_checker_agent import diagram_checker_agent
from .chat_query_generator_agent import chat_query_generator_agent
from .security_checker_agent import get_security_checker_agent

# --- Define the Diagram Agent ---
diagram_agent = SequentialAgent(
    name="diagram_agent",
    sub_agents=[
        get_security_checker_agent(),
        diagram_query_generator_agent,
        get_information_retrieval_agent(),
        diagram_generation_agent,
        diagram_checker_agent,
    ],
    description="This agent is responsible for generating diagrams based on user queries and information retrieval results.",
)

# --- Define the Chat Agent ---
chat_agent = SequentialAgent(
    name="chat_agent",
    sub_agents=[
        get_security_checker_agent(),
        chat_query_generator_agent,
        get_information_retrieval_agent(),
        response_formatter_agent,
    ],
    description="This agent is responsible for handling the user's request and returning the appropriate response.",
)
