from app.utils.github_handler import clone_repo
from sentence_transformers import SentenceTransformer
from pathlib import Path
import textwrap
import shutil
from pymongo import MongoClient
import os
from app.celery_app import celery_app
from dotenv import load_dotenv
from typing import List, Dict
import git

load_dotenv()

# MongoDB setup
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
mongo_client = MongoClient(mongo_uri)
db = mongo_client["CodeBuddy"]
collection = db["codebuddy"]


def chunk_code(content: str, max_tokens: int = 512) -> list:
    approx_chunk_len = max_tokens * 4
    return textwrap.wrap(
        content,
        width=approx_chunk_len,
        break_long_words=False,
        replace_whitespace=False,
    )


def generate_embedding(text: str) -> List[float]:
    """
    Generate an embedding for the given text using a pre-trained model.
    Args:
        text (str): The text to embed.
    Returns:
        List[float]: The embedding vector.
    """
    model = SentenceTransformer("all-MiniLM-L6-v2")
    return model.encode([text])[0].tolist()


@celery_app.task
def process_repository(user_id: str, repo_url: str, access_token: str | None = None):
    print("mongo_uri", mongo_uri)
    try:
        repo_path = clone_repo(repo_url, access_token)  # Shallow clone or full clone
        repo = git.Repo(repo_path)

        # Fetch all branches
        repo.git.fetch("--all")
        branches = [ref.name for ref in repo.remotes.origin.refs]

        supported_ext = [".py", ".js", ".ts", ".java", ".go", ".cpp", ".cs"]
        excluded_dirs = [
            "node_modules",
            "venv",
            "env",
            "__pycache__",
            ".git",
            "build",
            "dist",
            "target",
            "bin",
            "obj",
        ]

        for branch_ref in branches:
            branch_name = branch_ref.replace("origin/", "")
            try:
                repo.git.checkout("-f", branch_name)

                for file_path in Path(repo_path).rglob("*"):
                    # Skip excluded directories
                    if any(
                        excluded_dir in str(file_path) for excluded_dir in excluded_dirs
                    ):
                        continue

                    if file_path.suffix in supported_ext:
                        try:
                            text = file_path.read_text(encoding="utf-8")
                            chunks = chunk_code(text)

                            for i, chunk in enumerate(chunks):
                                # Generate embedding for the chunk
                                embedding = generate_embedding(chunk)

                                # Create a document for MongoDB
                                document = {
                                    "user_id": user_id,
                                    "repo_url": repo_url,
                                    "branch": branch_name,
                                    "file_path": str(file_path),
                                    "chunk_index": i,
                                    "chunk": chunk,
                                    "embedding": embedding,
                                }

                                collection.insert_one(document)

                                print(
                                    f"[{branch_name}] Stored chunk {i} of {file_path.name}"
                                )
                        except Exception as e:
                            print(f"[{branch_name}] Skipped {file_path}: {e}")
            except Exception as branch_err:
                print(f"Failed to process branch {branch_name}: {branch_err}")

    finally:
        shutil.rmtree(repo_path, ignore_errors=True)


def search_similar_code_chunks(query: str, top_k: int = 5) -> List[Dict]:
    """
    Search for code/document chunks most similar to the query using MongoDB vector search.
    Args:
        query (str): The user query to embed and search for.
        top_k (int): Number of top results to return. Default is 5.
    Returns:
        List[Dict]: List of matching code chunks with metadata and similarity score.
    """
    model = SentenceTransformer("all-MiniLM-L6-v2")
    query_embedding = model.encode([query])[0].tolist()

    pipeline = [
        {
            "$vectorSearch": {
                "index": "embedding",  # MongoDB Atlas vector index name
                "queryVector": query_embedding,
                "path": "embedding",
                "numCandidates": 100,
                "limit": top_k,
            }
        },
        {
            "$project": {
                "_id": 0,
                "repo_url": 1,
                "file_path": 1,
                "chunk_index": 1,
                "chunk": 1,
                "score": {"$meta": "vectorSearchScore"},
            }
        },
    ]
    results = list(collection.aggregate(pipeline))
    return results
