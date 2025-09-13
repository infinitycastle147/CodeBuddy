# Standard library imports
import os
import textwrap
import shutil
import datetime
from pathlib import Path
from typing import List, Dict, Optional

# Third-party imports
import git
import cohere
from dotenv import load_dotenv
from loguru import logger
from pymongo.errors import OperationFailure

# Local application imports
from app.utils.github_handler import clone_repo
from app.celery_app import celery_app
from app.db.mongodb import get_mongo_client
from app.constants.collections import CODE_EMBEDDINGS_COLLECTION
from settings import settings

# Load environment variables
load_dotenv()

# Constants
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
    """Split code content into chunks of approximately max_tokens size."""

    if not content or not content.strip():
        logger.warning("Received empty content for chunking")
        return []

    # Approximate characters per token (4 is a common estimate)
    approx_chunk_len = max_tokens * 4

    try:
        chunks = textwrap.wrap(
            content,
            width=approx_chunk_len,
            break_long_words=False,
            replace_whitespace=False,
        )
        logger.debug(f"Split content into {len(chunks)} chunks")
        return chunks
    except Exception as e:
        logger.error(f"Error chunking code: {e}")
        # Return a single chunk with the original content if chunking fails
        return [content]


def generate_embedding(text: str, is_query: bool) -> List[float]:
    """Generate an embedding for the given text using the configured provider."""

    co = cohere.ClientV2(api_key=settings.COHERE_API_KEY)

    if not text or not text.strip():
        logger.warning("Received empty text for embedding")
        return [0.0] * settings.EMBEDDING_SIZE

    input_type =  "search_query" if is_query else "search_document"

    try:

        # Embed the documents
        doc_emb = co.embed(
            model="embed-v4.0",
            input_type= input_type,
            texts=[text],
            embedding_types=["float"],
            output_dimension=settings.EMBEDDING_SIZE,
        ).embeddings.float
        
        return doc_emb
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        return [0.0] * settings.EMBEDDING_SIZE

def perform_reranking(query: str, results: List[Dict], top_k:int):
    """
    Perform reranking based on given query and documents.
    """
    co = cohere.ClientV2(api_key=settings.COHERE_API_KEY)

    # Prepare documents for reranking
    documents = []
    for result in results:
        doc_text = f"File: {result['file_path']}\n\n{result['chunk']}"
        documents.append(doc_text)

    try:

        # Embed the documents
        results = co.rerank(
            model="rerank-v3.5",
            query=query,
            documents=documents,
            top_n=top_k,
        )

        return results.results
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        return []


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

                            # TODO: Extract project name from repo_url and create file path accordingly for document storage , we will need correct path for that (Not the cloned one)

                            # Process each chunk
                            for i, chunk in enumerate(chunks):
                                # Generate embedding for the chunk
                                embedding = generate_embedding(chunk, False)

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
) -> List[Dict]:
    """Search for code/document chunks most similar to the query using MongoDB vector search."""

    if not query or not query.strip():
        logger.warning("Empty query provided for vector search")
        return []

    try:
        # Get MongoDB connection
        client = get_mongo_client()
        db = client[settings.mongo_db]
        collection = db[CODE_EMBEDDINGS_COLLECTION]

        # Generate query embedding
        query_embedding = generate_embedding(query, True)

        # Build the aggregation pipeline
        pipeline = []

        # Add match stage if filters are provided
        match_conditions = {}

        # Add vector search stage
        pipeline.append(
            {
                "$vectorSearch": {
                    "index": "embedding",  # MongoDB Atlas vector index name
                    "queryVector": query_embedding,
                    "path": "embedding",
                    "numCandidates": 100,
                    "limit": top_k * 4,
                }
            }
        )

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
        logger.info(f"Found {len(results)} results for vector search")

        # Perform reranking
        reranked_results = perform_reranking(
            query=query,
            results=results,
            top_k=top_k
        )

        # Convert back to original format
        final_results = []
        for rerank_result in reranked_results:
            original_result = results[rerank_result.index]
            result_dict = {
                'user_id': original_result['user_id'],
                'repo_url': original_result['repo_url'],
                'branch': original_result['branch'],
                'file_path': original_result['file_path'],
                'chunk_index': original_result['chunk_index'],
                'chunk': original_result['chunk']
            }
            final_results.append(result_dict)

        logger.info(f"Reranking complete. Returning {len(final_results)} results")
        return final_results

    except Exception as e:
        logger.error(f"Error in vector search: {e}")
        return []
