from loguru import logger

class AgentOperationError(Exception):
    """Custom exception for agent operation failures."""
    def __init__(self, message, original_exception=None):
        super().__init__(message)
        self.original_exception = original_exception

def handle_agent_error(context, error, agent_name="UnknownAgent"):
    logger.error(f"[{agent_name}] Error: {error}")
    context.state["error"] = str(error)
    return None