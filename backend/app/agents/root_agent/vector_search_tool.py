from typing import List, Dict
from sentence_transformers import SentenceTransformer
from pymongo import MongoClient
import os

# MongoDB setup
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
mongo_client = MongoClient(mongo_uri)
db = mongo_client["CodeBuddy"]
collection = db["codebuddy"]

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
    user_id = "123"

    pipeline = [
        {
            "$vectorSearch": {
                "index": "embedding",  # MongoDB Atlas vector index name
                "queryVector": query_embedding,
                "path": "embedding",
                "numCandidates": 100,
                "limit": top_k
            }
        },
        {
            "$match": {
                "user_id": user_id
            }
        },
        {
            "$project": {
                "_id": 0,
                "user_id": 1,
                "repo_url": 1,
                "file_path": 1,
                "branch": 1,
                "chunk_index": 1,
                "chunk": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]
    results = list(collection.aggregate(pipeline))
    return results

