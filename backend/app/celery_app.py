from celery import Celery


celery_app = Celery("CodeBuddy")
celery_app.config_from_object({
    'broker_url': 'redis://localhost:6379/0',
    'result_backend': 'redis://localhost:6379/1',
    'include': ['app.utils.embedder'],
    'task_serializer': 'json',
    'result_serializer': 'json',
    'accept_content': ['json']
}) 