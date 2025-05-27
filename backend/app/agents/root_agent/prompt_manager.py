# PromptManager for agent prompts

from .prompts.role_detection_prompt import ROLE_DETECTION_PROMPT
from .prompts.intent_detection_prompt import INTENT_DETECTION_PROMPT
from .prompts.response_generator_prompt import RESPONSE_GENERATOR_PROMPT
from .prompts.github_fetch_prompt import GITHUB_FETCH_PROMPT
from .prompts.code_indexer_prompt import CODE_INDEXER_PROMPT
from .prompts.schema_extractor_prompt import SCHEMA_EXTRACTOR_PROMPT
from .prompts.rag_retriever_prompt import RAG_RETRIEVER_PROMPT
from .prompts.summarization_prompt import SUMMARIZATION_PROMPT
from .prompts.uml_generator_prompt import UML_GENERATOR_PROMPT
from .prompts.erd_generator_prompt import ERD_GENERATOR_PROMPT
from .prompts.git_connector_prompt import GIT_CONNECTOR_PROMPT
from .prompts.jira_connector_prompt import JIRA_CONNECTOR_PROMPT
from .prompts.delivery_prompt import DELIVERY_PROMPT
from .prompts.information_retrieval_prompt import INFORMATION_RETRIEVAL_PROMPT
from .prompts.github_agent_prompt import GITHUB_AGENT_PROMPT
class PromptManager:
    _PROMPT_MAP = {
        "role_detection_agent": ROLE_DETECTION_PROMPT,
        "intent_detection_agent": INTENT_DETECTION_PROMPT,
        "response_generator_agent": RESPONSE_GENERATOR_PROMPT,
        "github_fetch_agent": GITHUB_FETCH_PROMPT,
        "code_indexer_agent": CODE_INDEXER_PROMPT,
        "schema_extractor_agent": SCHEMA_EXTRACTOR_PROMPT,
        "rag_retriever_agent": RAG_RETRIEVER_PROMPT,
        "summarization_agent": SUMMARIZATION_PROMPT,
        "uml_generator_agent": UML_GENERATOR_PROMPT,
        "erd_generator_agent": ERD_GENERATOR_PROMPT,
        "git_connector_agent": GIT_CONNECTOR_PROMPT,
        "jira_connector_agent": JIRA_CONNECTOR_PROMPT,
        "delivery_agent": DELIVERY_PROMPT,
        "information_retrieval_agent": INFORMATION_RETRIEVAL_PROMPT,
        "github_agent": GITHUB_AGENT_PROMPT,
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