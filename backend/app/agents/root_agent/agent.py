import os
from google.adk.agents import (
    LlmAgent,
    SequentialAgent,
    BaseAgent,
)   
from dotenv import load_dotenv
from .vector_search_tool import search_similar_code_chunks

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

# === 1. Role Detection Agent ===
role_detection_agent = LlmAgent(
    name="role_detection_agent",
    instruction="Detect the user's role based on usage context.",
    model="gemini-2.0-flash",
)

# === 2. Intent Detection with RAG ===
intent_detection_agent = LlmAgent(
    name="intent_detection_agent", 
    instruction="Use tools to answer the user's question. Tools available: `search_similar_code_chunks`",
    model="gemini-2.0-flash",
    tools=[search_similar_code_chunks]
)

# === 3. Response Generation ===
response_generator_agent = LlmAgent(
    name="response_generator_agent",
    instruction="Generate properly formatted response based on intent and context.",
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

# === Below agents commented out for future implementation ===

# === 2. Ingestion Workflow ===
# github_fetch_agent = LlmAgent(
#     name="github_fetch_agent",
#     instruction="Fetch or pull GitHub repo for the project.",
#     model="gemini-2.0-flash",
#     # api_key=API_KEY,
#     tools=[
#         MCPToolset(
#             connection_params=StdioServerParameters(
#                 command='npx',
#                 args=['-y', '@modelcontextprotocol/server-filesystem', '/project/code']
#             )
#         )
#     ]
# )

# code_indexer_agent = LlmAgent(
#     name="code_indexer_agent",
#     instruction="Index and embed code for retrieval.",
#     model="gemini-2.0-flash",
#     # api_key=API_KEY,
# )

# schema_extractor_agent = LlmAgent(
#     name="schema_extractor_agent",
#     instruction="Extract database schema from ORM or SQL files.",
#     model="gemini-2.0-pro",
#     # api_key=API_KEY,
# )

# ingestion_workflow = SequentialAgent(
#     name="ingestion_workflow",
#     agents=[github_fetch_agent, code_indexer_agent, schema_extractor_agent],
# )

# === 3. Retrieval & Processing ===
# rag_retriever_agent = LlmAgent(
#     name="rag_retriever_agent",
#     instruction="Retrieve relevant code snippets using vector embeddings.",
#     model="gemini-2.0-flash",
#     # api_key=API_KEY,
# )

# summarization_agent = LlmAgent(
#     name="summarization_agent",
#     instruction="Summarize relevant code tailored to the detected role.",
#     model="gemini-2.0-pro",
#     # api_key=API_KEY,
# )

# uml_generator_agent = LlmAgent(
#     name="uml_generator_agent",
#     instruction="Generate UML diagrams in Mermaid or PlantUML syntax.",
#     model="gemini-2.0-pro",
#     # api_key=API_KEY,
# )

# erd_generator_agent = LlmAgent(
#     name="erd_generator_agent",
#     instruction="Generate ERD diagrams from schema information.",
#     model="gemini-2.0-pro",
#     # api_key=API_KEY,
# )

# diagram_generation = ParallelAgent(
#     name="diagram_generation",
#     agents=[uml_generator_agent, erd_generator_agent],
# )

# retrieval_processing = ParallelAgent(
#     name="retrieval_processing",
#     agents=[rag_retriever_agent, summarization_agent, diagram_generation],
# )

# === 4. Integration Agents ===
# git_connector_agent = LlmAgent(
#     name="git_connector_agent",
#     instruction="Access commit history, diffs, and blame info from Git.",
#     model="gemini-2.0-flash",
#     # api_key=API_KEY,
# )

# jira_connector_agent = LlmAgent(
#     name="jira_connector_agent",
#     instruction="Integrate with Jira API for ticket linking and updates.",
#     model="gemini-2.0-pro",
#     # api_key=API_KEY,
# )

# integration_agents = ParallelAgent(
#     name="integration_agents",
#     agents=[git_connector_agent, jira_connector_agent],
# )

# === 5. Delivery Agent ===
# delivery_agent = LlmAgent(
#     name="delivery_agent",
#     instruction="Assemble all outputs into a multimodal response.",
#     model="gemini-2.0-pro",
#     # api_key=API_KEY,
# )

# === 6. Orchestrator ===
# Using core workflow for first prototype instead of full orchestration
orchestrator_agent = BaseAgent(
    name="orchestrator_agent",
    sub_agents=[core_workflow],
)

# Alias for external usage
root_agent = core_workflow
