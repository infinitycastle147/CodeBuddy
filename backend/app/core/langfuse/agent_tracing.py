"""
Enhanced agent-level tracing for multi-agent systems.

This module provides utilities to trace individual agents within the Google ADK
sequential agent chains, giving full visibility into multi-agent execution.
"""

from functools import wraps
from typing import Dict, Any, Optional
from langfuse import observe
from .client import get_langfuse_client
from loguru import logger

def trace_agent(agent_name: str, agent_type: str = "agent", metadata: Optional[Dict[str, Any]] = None):
    """
    Enhanced decorator for tracing individual agents in multi-agent systems.
    
    Args:
        agent_name: Name of the agent (e.g., "security_checker", "query_generator")
        agent_type: Type of agent (e.g., "security", "retrieval", "generation")
        metadata: Additional metadata for the agent
    
    Returns:
        Decorator function
    """
    def decorator(func):
        @wraps(func)
        @observe(
            name=f"{agent_name}_agent",
            metadata={
                "agent_type": agent_type,
                "agent_name": agent_name,
                **(metadata or {})
            }
        )
        async def async_wrapper(*args, **kwargs):
            return await func(*args, **kwargs)
        
        @wraps(func)
        @observe(
            name=f"{agent_name}_agent", 
            metadata={
                "agent_type": agent_type,
                "agent_name": agent_name,
                **(metadata or {})
            }
        )
        def sync_wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        
        # Return appropriate wrapper based on function type
        if hasattr(func, '__code__') and 'await' in func.__code__.co_names:
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator

def trace_agent_chain(chain_name: str, agents: list):
    """
    Trace an entire agent chain execution.
    
    Args:
        chain_name: Name of the agent chain (e.g., "chat_agent_chain", "diagram_agent_chain")
        agents: List of agent names in the chain
    
    Returns:
        Context manager for the chain trace
    """
    client = get_langfuse_client()
    if not client:
        return None
    
    return client.trace(
        name=chain_name,
        metadata={
            "chain_type": "sequential",
            "agents": agents,
            "agent_count": len(agents)
        }
    )

class AgentMetrics:
    """
    Utility class for tracking agent-specific metrics.
    """
    
    @staticmethod
    def log_agent_performance(agent_name: str, execution_time: float, success: bool, **kwargs):
        """
        Log agent performance metrics to Langfuse.
        
        Args:
            agent_name: Name of the agent
            execution_time: Time taken for execution
            success: Whether the agent executed successfully
            **kwargs: Additional metrics
        """
        client = get_langfuse_client()
        if not client:
            return
        
        try:
            client.score(
                name=f"{agent_name}_performance",
                value=1.0 if success else 0.0,
                comment=f"Execution time: {execution_time:.2f}s",
                metadata={
                    "execution_time": execution_time,
                    "success": success,
                    **kwargs
                }
            )
        except Exception as e:
            logger.error(f"Failed to log agent metrics: {e}")

# Pre-defined agent tracers for your specific agents
trace_security_agent = trace_agent("security_checker", "security", {"purpose": "input_validation"})
trace_query_generator = trace_agent("query_generator", "processing", {"purpose": "query_refinement"}) 
trace_info_retrieval = trace_agent("information_retrieval", "retrieval", {"purpose": "context_gathering"})
trace_response_formatter = trace_agent("response_formatter", "formatting", {"purpose": "output_formatting"})
trace_diagram_generator = trace_agent("diagram_generator", "generation", {"purpose": "diagram_creation"})
trace_diagram_checker = trace_agent("diagram_checker", "validation", {"purpose": "diagram_validation"})