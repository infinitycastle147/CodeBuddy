from .setup_router import router as setup_router
from .chat_router import router as chat_router
from .diagram_router import router as diagram_router
from .user_router import router as user_router
from .test_router import router as test_router

__all__ = ["setup_router", "chat_router", "diagram_router", "user_router", "test_router"]
