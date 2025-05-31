from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.embedder import process_repository
from celery.result import AsyncResult
from app.celery.worker import celery_app
from app.agents.root_agent import get_chat_agent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types


router = APIRouter(prefix="/tools", tags=["tools"])

class RepoRequest(BaseModel):
    repo_url: str
    access_token: str | None = None

class DiagramRequest(BaseModel):
    user_input: str
    diagram_type: str

class VectorSearchRequest(BaseModel):
    query: str
    top_k: int = 5

class RootAgentRequest(BaseModel):
    user_input: str

@router.get("/health")
def health_check():
    return {"message": "Tools router is healthy", "status": "ok"}, 200

@router.post("/setup")
async def setup_repo(request: RepoRequest):
    print(request, "request")
    user_id = "123"
    try:
        task = process_repository.delay(user_id, request.repo_url, request.access_token)
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

@router.post("/chat")
async def chat(request: RootAgentRequest):
    """
    Chat endpoint for interacting with the AI assistant.
    
    Request Body:
    {
        "user_input": string  // The user's message or question
    }

    Returns:
    {
        "result": string  // The AI assistant's response message
    }
    """
    try:
        print(request, "request")
        print("Running root agent")
        session_service = InMemorySessionService()

        session = await session_service.create_session(
            app_name="codebuddy",
            user_id="123",
        )
        
        print("session is ready", session)

        print("Getting root agent")
        root_agent = get_chat_agent(request.user_input)
        print("Root agent is ready")

        content = types.Content(role='user', parts=[types.Part(text=request.user_input)])

        print("Content is ready")

        runner = Runner(agent=root_agent, app_name="codebuddy", session_service=session_service)
        
        print("Runner is ready")

        events = runner.run_async(user_id=session.user_id, session_id=session.id, new_message=content)
        
        print("Events are ready")

        async for event in events:
            if event.is_final_response():
                final_response = event.content.parts[0].text          
                print("Final response is ready")
                return {"result": final_response}

        print("No final response from agent.")
        
        return {"result": "No final response from agent."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
    
@router.post("/diagram")
async def generate_diagram(request: DiagramRequest):
    """
    Generate a diagram based on user input.

    Request Body:
    {
        "user_input": string,     // Description or requirements for the diagram
        "diagram_type": string    // Type of diagram to generate (e.g. "uml", "erd")
    }

    Returns:
    {
        "message": string,        // Status message
        "request": object         // Echo of the original request
    }
    """
    try:
        print(request, "request")
        print("Generating diagram")
        return {"message": "Diagram generation started", "request": request}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))