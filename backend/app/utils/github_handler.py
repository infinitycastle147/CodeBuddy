import git
from pathlib import Path
import shutil
import uuid

def create_secure_temp_dir() -> Path:
    """
    Create a secure temporary directory for cloning repositories.
    """
    temp_dir = Path(f"./clones/{uuid.uuid4()}")
    temp_dir.mkdir(parents=True, exist_ok=True)
    return temp_dir


def clone_repo(repo_url: str, access_token: str | None) -> str:
    """
    Clone a GitHub repository to a secure temporary directory.
    Args:
        repo_url (str): The URL of the GitHub repository to clone.
        access_token (str | None): Optional access token for private repositories.
    Returns:
        str: The path to the cloned repository.
    Raises:
        ValueError: If the repository size exceeds 100MB.
        RuntimeError: If the cloning process fails.
    """
    
    # Create a secure temporary directory
    temp_dir =  create_secure_temp_dir()
    repo_url_mod = repo_url

    if access_token and repo_url.startswith("https://"):
        repo_url_mod = repo_url.replace("https://", f"https://{access_token}@")

    try:
        git.Repo.clone_from(repo_url_mod, str(temp_dir))

        # Validate size < 100MB
        size_mb = (
            sum(f.stat().st_size for f in temp_dir.rglob("*") if f.is_file()) / 1e6
        )
        if size_mb > 100:
            shutil.rmtree(temp_dir)
            raise ValueError("Repo too large (>100MB)")

        print(temp_dir, "temp_dir")
        return str(temp_dir)
    except Exception as e:
        raise RuntimeError(f"Clone failed: {e}")
