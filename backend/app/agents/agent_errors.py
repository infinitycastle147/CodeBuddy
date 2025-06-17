from loguru import logger

class AgentOperationError(Exception):
    """Custom exception for agent operation failures."""
    def __init__(self, message, original_exception=None):
        super().__init__(message)
        self.original_exception = original_exception

def handle_agent_error(context, error, agent_name="UnknownAgent"):
    logger.error(f"[{agent_name}] Error: {error}")
    # Optionally, add more sophisticated error reporting here (e.g., Sentry, alerts)
    # You can also update the context state with error info if needed
    context.state["error"] = str(error)
    return None