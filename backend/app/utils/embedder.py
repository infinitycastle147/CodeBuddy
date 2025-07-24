# Standard library imports
import os
import textwrap
import shutil
import datetime
from pathlib import Path
from typing import List, Dict, Optional

# Third-party imports
import git
from dotenv import load_dotenv
from loguru import logger
from pymongo.errors import OperationFailure
from cohere import Client

# Local application imports
from app.utils.github_handler import clone_repo
from app.celery_app import celery_app
from app.db.mongodb import get_mongo_client
from app.constants.collections import CODE_EMBEDDINGS_COLLECTION
from settings import settings

# Load environment variables
load_dotenv()

# Constants
EMBEDDING_MODEL = "embed-v4.0"
RERANKING_MODEL = "rerank-v3.5"
EMBEDDING_DIMENSIONS = 512
SUPPORTED_EXTENSIONS = [".py", ".js", ".ts", ".java", ".go", ".cpp", ".cs"]
EXCLUDED_DIRS = [
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


def chunk_code(content: str, max_tokens: int = 512) -> List[str]:
    """
    Split code content into chunks of approximately max_tokens size.

    Args:
        content (str): The code content to chunk.
        max_tokens (int): Maximum number of tokens per chunk (approximate).

    Returns:
        List[str]: List of code chunks.
    """
    if not content or not content.strip():
        logger.warning("Received empty content for chunking")
        return []

    try:
        # Simple word-based chunking for better context preservation
        words = content.split()
        chunks = []
        current_chunk = []
        current_length = 0
        
        for word in words:
            word_length = len(word.split()) + 1  # +1 for space
            if current_length + word_length > max_tokens and current_chunk:
                chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_length = word_length
            else:
                current_chunk.append(word)
                current_length += word_length
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        logger.debug(f"Split content into {len(chunks)} chunks")
        return chunks if chunks else [content]
    except Exception as e:
        logger.error(f"Error chunking code: {e}")
        return [content]


# Initialize Cohere client
_cohere_client = None


def get_cohere_client() -> Client:
    """
    Get or initialize the Cohere client.

    Returns:
        Client: The initialized Cohere client.
    """
    global _cohere_client
    if _cohere_client is None:
        api_key = os.getenv('COHERE_API_KEY')
        if not api_key:
            raise ValueError("COHERE_API_KEY environment variable is required")
        
        _cohere_client = Client(api_key=api_key)
        logger.info(f"Initialized Cohere client with embedding model: {EMBEDDING_MODEL}")
    
    return _cohere_client


def generate_embedding(text: str) -> List[float]:
    """
    Generate an embedding for the given text using Cohere.

    Args:
        text (str): The text to embed.

    Returns:
        List[float]: The embedding vector.
    """
    if not text or not text.strip():
        logger.warning("Received empty text for embedding")
        return [0.0] * EMBEDDING_DIMENSIONS

    try:
        client = get_cohere_client()
        
        response = client.embed(
            texts=[text],
            model=EMBEDDING_MODEL,
            input_type="search_document",
            embedding_types=['float']
        )
        
        return response.embeddings[0]
    except Exception as e:
        logger.error(f"Error generating embedding with Cohere: {e}")
        raise


def rerank_documents(query: str, documents: List[Dict], top_k: int = 5) -> List[Dict]:
    """
    Rerank documents using Cohere reranking model.

    Args:
        query (str): The search query.
        documents (List[Dict]): List of documents with 'chunk' field.
        top_k (int): Number of top results to return.

    Returns:
        List[Dict]: Reranked documents with relevance scores.
    """
    if not query or not documents:
        logger.warning("Empty query or documents for reranking")
        return documents[:top_k]

    try:
        client = get_cohere_client()
        
        # Extract text from documents
        doc_texts = [doc.get('chunk', str(doc)) for doc in documents]
        
        # Cohere rerank API has a limit of 1000 documents
        if len(doc_texts) > 1000:
            logger.warning(f"Too many documents ({len(doc_texts)}), limiting to 1000")
            doc_texts = doc_texts[:1000]
            documents = documents[:1000]
        
        response = client.rerank(
            query=query,
            documents=doc_texts,
            model=RERANKING_MODEL,
            top_n=top_k,
            return_documents=True
        )
        
        # Combine reranked results with original document metadata
        reranked_docs = []
        for result in response.results:
            original_doc = documents[result.index].copy()
            original_doc['relevance_score'] = result.relevance_score
            reranked_docs.append(original_doc)
        
        logger.info(f"Reranked {len(documents)} documents, returning top {len(reranked_docs)}")
        return reranked_docs
        
    except Exception as e:
        logger.error(f"Error reranking documents with Cohere: {e}")
        # Return original documents on error
        return documents[:top_k]


@celery_app.task
def process_repository(
    user_id: str,
    repo_url: str,
    access_token: Optional[str] = None,
    max_size_mb: int = 100,
):
    """
    Process a Git repository by cloning it, extracting code chunks, generating embeddings,
    and storing them in MongoDB.

    Args:
        user_id (str): The ID of the user who owns the repository.
        repo_url (str): The URL of the repository to process.
        access_token (Optional[str]): GitHub access token for private repositories.
        max_size_mb (int): Maximum repository size in MB to process.
    """
    repo_path = None
    processed_files = 0
    processed_chunks = 0
    try:
        # Ensure MongoDB connection is available
        mongo_client = get_mongo_client()
        db = mongo_client[settings.mongo_db]
        collection = db[CODE_EMBEDDINGS_COLLECTION]
        
        # Clone the repository
        logger.info(f"Cloning repository: {repo_url} for user: {user_id}")
        repo_path = clone_repo(repo_url, access_token, max_size_mb=max_size_mb)
        repo = git.Repo(repo_path)

        # Fetch all branches
        logger.info("Fetching all branches")
        repo.git.fetch("--all")
        branches = [ref.name for ref in repo.remotes.origin.refs]
        logger.info(f"Found {len(branches)} branches")

        for branch_ref in branches:
            branch_name = branch_ref.replace("origin/", "")
            try:
                logger.info(f"Processing branch: {branch_name}")
                repo.git.checkout("-f", branch_name)

                for file_path in Path(repo_path).rglob("*"):
                    # Skip excluded directories
                    if any(
                        excluded_dir in file_path.parts
                        for excluded_dir in EXCLUDED_DIRS
                    ):
                        continue

                    if (
                        file_path.suffix in SUPPORTED_EXTENSIONS
                        and file_path.is_file()
                    ):
                        try:
                            # Read file content with error handling for encoding issues
                            try:
                                text = file_path.read_text(encoding="utf-8")
                            except UnicodeDecodeError:
                                logger.warning(
                                    f"Skipping file with encoding issues: {file_path}"
                                )
                                continue

                            # Skip empty files
                            if not text.strip():
                                continue

                            # Generate chunks and embeddings
                            chunks = chunk_code(text, max_tokens=512)
                            if not chunks:
                                continue

                            # Process each chunk
                            for i, chunk in enumerate(chunks):
                                # Generate embedding for the chunk
                                embedding = generate_embedding(chunk)

                                # Create a document for MongoDB
                                document = {
                                    "user_id": user_id,
                                    "repo_url": repo_url,
                                    "branch": branch_name,
                                    "file_path": str(
                                        file_path.relative_to(repo_path)
                                    ),
                                    "chunk_index": i,
                                    "chunk": chunk,
                                    "embedding": embedding,
                                    "created_at": datetime.datetime.utcnow(),
                                }

                                # Insert into MongoDB with error handling
                                try:
                                    collection.insert_one(document)
                                    processed_chunks += 1
                                except OperationFailure as e:
                                    logger.error(f"MongoDB operation failed: {e}")
                                    continue

                            processed_files += 1

                            # Log progress periodically
                            if processed_files % 10 == 0:
                                logger.info(
                                    f"[{branch_name}] Processed {processed_files} files, {processed_chunks} chunks"
                                )

                        except Exception as e:
                            logger.error(
                                f"[{branch_name}] Error processing {file_path}: {e}"
                            )

            except Exception as branch_err:
                logger.error(
                    f"Failed to process branch {branch_name}: {branch_err}"
                )

        logger.info(
            f"Repository processing complete. Processed {processed_files} files and {processed_chunks} chunks."
        )
        return {
            "status": "success",
            "files_processed": processed_files,
            "chunks_processed": processed_chunks,
        }

    except Exception as e:
        logger.error(f"Repository processing failed: {e}")
        return {"status": "error", "error": str(e)}

    finally:
        # Clean up the temporary repository directory
        if repo_path and os.path.exists(repo_path):
            logger.info(f"Cleaning up repository directory: {repo_path}")
            shutil.rmtree(repo_path, ignore_errors=True)


async def search_similar_code_chunks(
    query: str,
    top_k: int = 5,
    user_id: Optional[str] = None,
    repo_url: Optional[str] = None,
    use_reranking: bool = True,
) -> List[Dict]:
    """
    Search for code/document chunks most similar to the query using MongoDB vector search.
    Optionally apply Cohere reranking for better results.

    Args:
        query (str): The user query to embed and search for.
        top_k (int): Number of top results to return. Default is 5.
        user_id (Optional[str]): Filter results by user ID.
        repo_url (Optional[str]): Filter results by repository URL.
        use_reranking (bool): Whether to apply Cohere reranking. Default is True.

    Returns:
        List[Dict]: List of matching code chunks with metadata and similarity score.
    """
    if not query or not query.strip():
        logger.warning("Empty query provided for vector search")
        return []

    try:
        # Get MongoDB connection
        client = get_mongo_client()
        db = client[settings.mongo_db]
        collection = db[CODE_EMBEDDINGS_COLLECTION]

        # Generate query embedding
        query_embedding = generate_embedding(query)

        # Build the aggregation pipeline - get more candidates for reranking
        pipeline = []
        initial_limit = max(top_k * 3, 50) if use_reranking else top_k  # Get more for reranking

        # Add vector search stage
        pipeline.append(
            {
                "$vectorSearch": {
                    "index": "embedding",  # MongoDB Atlas vector index name
                    "queryVector": query_embedding,
                    "path": "embedding",
                    "numCandidates": 100,
                    "limit": initial_limit,
                }
            }
        )

        # Add match stage if filters are provided
        match_conditions = {}
        if user_id:
            match_conditions["user_id"] = user_id
        if repo_url:
            match_conditions["repo_url"] = repo_url

        if match_conditions:
            pipeline.append({"$match": match_conditions})

        # Project only needed fields
        pipeline.append(
            {
                "$project": {
                    "_id": 0,
                    "user_id": 1,
                    "repo_url": 1,
                    "branch": 1,
                    "file_path": 1,
                    "chunk_index": 1,
                    "chunk": 1,
                    "score": {"$meta": "vectorSearchScore"},
                }
            }
        )

        # Execute the aggregation pipeline
        logger.info(
            f"Executing vector search for query: '{query}' with filters: user_id={user_id}, repo_url={repo_url}"
        )
        results = list(collection.aggregate(pipeline))
        logger.info(f"Found {len(results)} results from vector search")

        # Apply reranking if requested and we have results
        if use_reranking and results:
            results = rerank_documents(query, results, top_k)
            logger.info(f"Reranked results, returning {len(results)} documents")

        return results[:top_k]

    except Exception as e:
        logger.error(f"Error in vector search: {e}")
        # Return empty list on error instead of raising to avoid breaking the API
        return []
