import git
from pathlib import Path
import shutil
import uuid
from loguru import logger
from typing import Optional

def create_secure_temp_dir() -> Path:
    """Create a secure temporary directory for cloning repositories."""

    # Use environment variable for base directory if available, otherwise use default
    base_dir = "./clones"
    temp_dir = Path(base_dir) / str(uuid.uuid4())
    
    try:
        temp_dir.mkdir(parents=True, exist_ok=True)
        return temp_dir
    except Exception as e:
        logger.error(f"Failed to create temporary directory: {e}")
        raise RuntimeError(f"Failed to create temporary directory: {e}")


def clone_repo(repo_url: str, access_token: Optional[str] = None, max_size_mb: int = 100) -> str:
    """Clone a GitHub repository to a secure temporary directory."""
    
    # Create a secure temporary directory
    temp_dir = create_secure_temp_dir()
    repo_url_mod = repo_url

    # Add access token to URL if provided
    if access_token and repo_url.startswith("https://"):
        repo_url_mod = repo_url.replace("https://", f"https://{access_token}@")

    try:
        logger.info(f"Cloning repository: {repo_url} to {temp_dir}")
        # Clone with depth=1 for faster cloning (only latest commit)
        git.Repo.clone_from(repo_url_mod, str(temp_dir), depth=1)

        # Validate repository size
        size_mb = sum(f.stat().st_size for f in temp_dir.rglob("*") if f.is_file()) / 1e6
        logger.debug(f"Repository size: {size_mb:.2f}MB")
        
        if size_mb > max_size_mb:
            logger.warning(f"Repository too large: {size_mb:.2f}MB (max: {max_size_mb}MB)")
            shutil.rmtree(temp_dir)
            raise ValueError(f"Repository too large: {size_mb:.2f}MB (max: {max_size_mb}MB)")

        logger.info(f"Successfully cloned repository to {temp_dir}")
        return str(temp_dir)
    except Exception as e:
        logger.error(f"Failed to clone repository: {e}")
        # Clean up the temporary directory if it exists
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)
        raise RuntimeError(f"Clone failed: {e}")
