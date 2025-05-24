import git
from pathlib import Path
import shutil
import uuid


def clone_repo(repo_url: str, access_token: str | None) -> str:
    temp_dir = Path(f"./clones/{uuid.uuid4()}")
    repo_url_mod = repo_url

    if access_token and repo_url.startswith("https://"):
        repo_url_mod = repo_url.replace("https://", f"https://{access_token}@")

    try:
        git.Repo.clone_from(repo_url_mod, str(temp_dir))

        # Validate size < 100MB
        size_mb = sum(f.stat().st_size for f in temp_dir.rglob("*") if f.is_file()) / 1e6
        if size_mb > 100:
            shutil.rmtree(temp_dir)
            raise ValueError("Repo too large (>100MB)")

        print(temp_dir, "temp_dir")
        return str(temp_dir)
    except Exception as e:
        raise RuntimeError(f"Clone failed: {e}")

