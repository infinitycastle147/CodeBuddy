# Standard Library Imports
# (No standard library imports in this case)

# Third-Party Imports
from celery import Celery

# Application-Specific Imports
from settings import settings

# Initialize Celery application
celery_app = Celery("CodeBuddy")

# Configure Celery application
celery_app.config_from_object(
    {
        "broker_url": settings.redis_url,  # Redis broker URL
        "result_backend": settings.redis_url,  # Redis result backend
        "include": ["app.utils.embedder"],  # Tasks to include
        "task_serializer": "json",  # Task serialization format
        "result_serializer": "json",  # Result serialization format
        "accept_content": ["json"],  # Accepted content types
    }
)
