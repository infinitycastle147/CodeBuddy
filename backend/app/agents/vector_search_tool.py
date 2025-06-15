# Standard library imports
from typing import List, Dict, Optional

# Third-party library imports
from sentence_transformers import SentenceTransformer
from loguru import logger

# Application imports
from app.db.mongodb import get_mongo_client, get_db_and_collection


def search_similar_code_chunks(query: str, user_id: str = None, repo_url: str = None, top_k: int = 5) -> List[Dict]:

    client = get_mongo_client()
    _, collection = get_db_and_collection(client)

    """
    Search for code/document chunks most similar to the query using MongoDB vector search.
    Optionally filter by user_id and/or repo_url for more efficient searching.

    Args:
        query (str): The user query to embed and search for.
        user_id (str, optional): Filter results by user ID.
        repo_url (str, optional): Filter results by repository URL.
        top_k (int): Number of top results to return. Default is 5.

    Returns:
        List[Dict]: List of matching code chunks with metadata and similarity score.
    """
    # Load the sentence transformer model
    logger.debug("Loading SentenceTransformer model...")

    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    # Generate the query embedding
    query_embedding = model.encode([query])[0].tolist()

    # Build the aggregation pipeline
    pipeline = []
    
    # Add match stage if filtering by user_id or repo_url
    match_conditions = {}
    if user_id:
        match_conditions["user_id"] = user_id
    if repo_url:
        match_conditions["repo_url"] = repo_url
    
    if match_conditions:
        pipeline.append({"$match": match_conditions})
        logger.info(f"Filtering vector search by: {match_conditions}")
    
    # Add vector search stage
    pipeline.append({
        "$vectorSearch": {
            "index": "embedding",  
            "queryVector": query_embedding,
            "path": "embedding",
            "numCandidates": 100,
            "limit": top_k,
        }
    })
    
    # Add projection stage
    pipeline.append({
        "$project": {
            "_id": 0,
            "user_id": 1,
            "repo_url": 1,
            "file_path": 1,
            "branch": 1,
            "chunk_index": 1,
            "chunk": 1,
            "score": {"$meta": "vectorSearchScore"},
        }
    })

    # Execute the aggregation pipeline and return results
    try:
        results = list(collection.aggregate(pipeline))
        
        logger.info(f"Found {len(results)} results for query: '{query}'")
        if not results:
            logger.warning("No results found.")
            return []
            
        logger.debug(f"Top result score: {results[0]['score'] if results else 'N/A'}")
        return results
    except Exception as e:
        logger.error(f"Error during vector search: {e}")
        return []
