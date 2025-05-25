import os
from google.adk.agents import (
    LlmAgent,
    SequentialAgent,
)   
from dotenv import load_dotenv
from .vector_search_tool import search_similar_code_chunks
from .prompt_manager import PromptManager

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

# === 1. Role Detection Agent ===
role_detection_agent = LlmAgent(
    name="role_detection_agent",
    instruction=PromptManager.get_prompt("role_detection_agent"),
    model="gemini-2.0-flash",
)

# === 2. Intent Detection with RAG ===
intent_detection_agent = LlmAgent(
    name="intent_detection_agent", 
    instruction=PromptManager.get_prompt("intent_detection_agent"),
    model="gemini-2.0-flash",
    tools=[search_similar_code_chunks]
)

# === 3. Response Generation ===
response_generator_agent = LlmAgent(
    name="response_generator_agent",
    instruction=PromptManager.get_prompt("response_generator_agent"),
    model="gemini-2.0-flash", 
)

# Core workflow for first prototype
core_workflow = SequentialAgent(
    name="core_workflow",
    sub_agents=[
        role_detection_agent,
        intent_detection_agent,
        response_generator_agent
    ]
)

# Alias for external usage
root_agent = core_workflow
