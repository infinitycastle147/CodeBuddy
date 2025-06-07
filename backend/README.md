commands to run the code
```bash
# Initialize the environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# start redis server
docker run -p 6379:6379 redis

# Run the application
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1

# see celery logs
celery -A worker.celery_app worker --loglevel=info

