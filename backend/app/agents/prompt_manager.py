# PromptManager for agent prompts

from .prompts.information_retrieval_agent_prompt import INFORMATION_RETRIEVAL_AGENT_PROMPT
from .prompts.response_formatter_agent_prompt import RESPONSE_FORMATTER_AGENT_PROMPT
from .prompts.diagram_generation_prompt import DIAGRAM_GENERATION_PROMPT
from .prompts.root_agent import ROOT_AGENT_PROMPT

class PromptManager:
    _PROMPT_MAP = {
        "information_retrieval_agent": INFORMATION_RETRIEVAL_AGENT_PROMPT,
        "response_formatter_agent": RESPONSE_FORMATTER_AGENT_PROMPT,
        "diagram_generation_agent": DIAGRAM_GENERATION_PROMPT,
        "root_agent": ROOT_AGENT_PROMPT,
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
            KeyError: If the agent name is not found.
        """
        try:
            return cls._PROMPT_MAP[agent_name]
        except KeyError:
            raise KeyError(f"Prompt for agent '{agent_name}' not found.") 