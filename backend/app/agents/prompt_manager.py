# PromptManager for managing agent prompts

# Standard Library Imports
# (None in this case)

# Third-Party Imports
# (None in this case)

# Local Application Imports
from .prompts.information_retrieval_agent_prompt import INFORMATION_RETRIEVAL_AGENT_PROMPT
from .prompts.response_formatter_agent_prompt import RESPONSE_FORMATTER_AGENT_PROMPT
from .prompts.diagram_generation_prompt import DIAGRAM_GENERATION_PROMPT
from .prompts.diagram_query_generator import DIAGRAM_QUERY_GENERATOR_PROMPT
from .prompts.diagram_agent_prompt import DIAGRAM_AGENT_PROMPT
from .prompts.diagram_checker_agent_prompt import DIAGRAM_CHECKER_AGENT_PROMPT
from .prompts.chat_query_generator_agent_prompt import CHAT_QUERY_GENERATOR_AGENT_PROMPT
from .prompts.security_checker_agent_prompt import SECURITY_CHECKER_AGENT_PROMPT
from .prompts.diagram_updater_agent_prompt import DIAGRAM_UPDATER_AGENT_PROMPT

class PromptManager:
    """
    A manager class for retrieving prompts associated with different agents.
    """

    # Mapping of agent names to their respective prompts
    _PROMPT_MAP = {
        "information_retrieval_agent": INFORMATION_RETRIEVAL_AGENT_PROMPT,
        "response_formatter_agent": RESPONSE_FORMATTER_AGENT_PROMPT,
        "diagram_generation_agent": DIAGRAM_GENERATION_PROMPT,
        "diagram_query_generator": DIAGRAM_QUERY_GENERATOR_PROMPT,
        "diagram_agent": DIAGRAM_AGENT_PROMPT,
        "diagram_checker_agent": DIAGRAM_CHECKER_AGENT_PROMPT,
        "chat_query_generator_agent": CHAT_QUERY_GENERATOR_AGENT_PROMPT,
        "security_checker_agent": SECURITY_CHECKER_AGENT_PROMPT, 
        "diagram_updater_agent": DIAGRAM_UPDATER_AGENT_PROMPT
    }

    @classmethod
    def get_prompt(cls, agent_name: str) -> str:
        """
        Retrieve the prompt for a given agent name.

        Args:
            agent_name (str): The name of the agent.

        Returns:
            str: The prompt string for the agent.

        Raises:
            KeyError: If the agent name is not found in the prompt map.
        """
        if agent_name not in cls._PROMPT_MAP:
            raise KeyError(f"Prompt for agent '{agent_name}' not found.")
        return cls._PROMPT_MAP[agent_name]