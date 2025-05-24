from app.utils.github_handler import clone_repo
from sentence_transformers import SentenceTransformer
from pathlib import Path
import textwrap
import shutil
from pymongo import MongoClient
import os
from app.celery_app import celery_app

# MongoDB setup
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
mongo_client = MongoClient(mongo_uri)
db = mongo_client["CodeBuddy"]
collection = db["codebuddy"]


def chunk_code(content: str, max_tokens: int = 512) -> list:
    approx_chunk_len = max_tokens * 4  
    return textwrap.wrap(content, width=approx_chunk_len, break_long_words=False, replace_whitespace=False)


@celery_app.task
def process_repository(repo_url: str, access_token: str | None = None):
    model = SentenceTransformer("all-MiniLM-L6-v2")
    print(mongo_uri, "mongo_uri")
    try:
        repo_path = clone_repo(repo_url, access_token)

        supported_ext = [".py", ".js", ".ts", ".java", ".go", ".cpp", ".cs"]
        for file_path in Path(repo_path).rglob("*"):
            if file_path.suffix in supported_ext:
                try:
                    text = file_path.read_text(encoding="utf-8")
                    chunks = chunk_code(text)

                    for i, chunk in enumerate(chunks):
                        embedding = model.encode([chunk])[0].tolist()
                        document = {
                            "repo_url": repo_url,
                            "file_path": str(file_path),
                            "chunk_index": i,
                            "chunk": chunk,
                            "embedding": embedding
                        }
                        collection.insert_one(document)
                        print(f"Stored chunk {i} of {file_path.name}")
                except Exception as e:
                    print(f"Skipped {file_path}: {e}")
    finally:
        shutil.rmtree(repo_path, ignore_errors=True)
