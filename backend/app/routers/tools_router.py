from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.embedder import process_repository, search_similar_code_chunks
from celery.result import AsyncResult
from app.celery.worker import celery_app
from app.agents.root_agent import get_github_agent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types


router = APIRouter(prefix="/tools", tags=["tools"])

class RepoRequest(BaseModel):
    repo_url: str
    access_token: str | None = None

class VectorSearchRequest(BaseModel):
    query: str
    top_k: int = 5

class RootAgentRequest(BaseModel):
    user_input: str

@router.get("/health")
def health_check():
    return {"message": "Tools router is healthy", "status": "ok"}, 200

@router.get("/")
def get_tools():
    return {"message": "Tools router is working"}

@router.post("/setup")
async def setup_repo(request: RepoRequest):
    print(request, "request")
    try:
        task = process_repository.delay(request.repo_url, request.access_token)
        return {"status": "processing", "task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/task-status/{task_id}")
def get_task_status(task_id: str):
    result = AsyncResult(task_id, app=celery_app)
    return {"task_id": task_id, "status": result.status}

@router.post("/index")
def create_code_index(repo_url: str):
    """Crawls the repository, builds embeddings, and creates a search index."""
    return {"message": "Indexing started for repo", "repo_url": repo_url}

@router.post("/retrieve")
def retrieve_relevant_code(query: str, top_k: int = 5):
    """Retrieves the top-K relevant code snippets or documentation."""
    return {"message": "Retrieved relevant code", "query": query, "top_k": top_k}

@router.post("/diagram/uml")
def generate_uml_diagram(code_subset: str):
    """Generates a PlantUML or Mermaid diagram from the provided code subset."""
    return {"message": "UML diagram generated"}

@router.post("/diagram/erd")
def generate_erd_diagram(database_schema: str):
    """Extracts the database schema and outputs an ERD in JSON or image format."""
    return {"message": "ERD generated"}

@router.post("/summarize")
def summarize_context(context: str):
    """Condenses the retrieved context into a plain-language summary."""
    return {"message": "Summary generated"}

@router.post("/git/log")
def fetch_git_commit_history(repo_url: str):
    """Fetches commit history and diff summaries from the repository."""
    return {"message": "Git commit history fetched", "repo_url": repo_url}

@router.post("/jira/search")
def query_jira_tickets(jira_query: str):
    """Queries Jira tickets and updates their status as needed."""
    return {"message": "Jira tickets queried", "jira_query": jira_query}

@router.post("/feedback")
def collect_user_feedback(feedback: str, tool_name: str):
    """Captures user ratings to refine summaries or diagrams."""
    return {"message": "Feedback received", "tool_name": tool_name}

@router.post("/vector-search")
def vector_search(request: VectorSearchRequest):
    """
    Performs a vector search over code/document chunks using the user's query.
    """
    try:
        results = search_similar_code_chunks(request.query, request.top_k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/agent/root")
async def run_root_agent(request: RootAgentRequest):
    """
    Runs the Google ADK root agent workflow on the provided user input.
    """
    try:

        print("Running root agent")
        # Set up session service and session (await the coroutine)
        session_service = InMemorySessionService()

        session = await session_service.create_session(
            app_name="codebuddy",
            user_id="123",
        )

        print("Getting github agent")
        github_agent = get_github_agent()

        print("Github agent is ready")


        # Prepare the user input as ADK content
        content = types.Content(role='user', parts=[types.Part(text=request.user_input)])

        print("Content is ready")

        # Set up the runner
        runner = Runner(agent=github_agent, app_name="codebuddy", session_service=session_service)
        
        print("Runner is ready")
        # Run the agent
        events = runner.run_async(user_id=session.user_id, session_id=session.id, new_message=content)

        print("Events are ready")

        # Collect the final response
        async for event in events:
            if event.is_final_response():
                final_response = event.content.parts[0].text
                print("Final response is ready")
                return {"result": final_response}

        print("No final response from agent.")
        return {"result": "No final response from agent."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 