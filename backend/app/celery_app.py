# Standard Library Imports
# (No standard library imports in this case)

# Third-Party Imports
from celery import Celery

# Application-Specific Imports
# (No application-specific imports in this case)

# Initialize Celery application
celery_app = Celery("CodeBuddy")

# Configure Celery application
celery_app.config_from_object(
    {
        "broker_url": "redis://localhost:6379/0",  # Redis broker URL
        "result_backend": "redis://localhost:6379/1",  # Redis result backend
        "include": ["app.utils.embedder"],  # Tasks to include
        "task_serializer": "json",  # Task serialization format
        "result_serializer": "json",  # Result serialization format
        "accept_content": ["json"],  # Accepted content types
    }
)
