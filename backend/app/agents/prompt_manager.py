# PromptManager for managing agent prompts

# Standard Library Imports
# (None in this case)

# Third-Party Imports
# (None in this case)

# Local Application Imports
from app.constants.diagram_types import DiagramType
from .prompts.information_retrieval_agent_prompt import (
    INFORMATION_RETRIEVAL_AGENT_PROMPT,
)
from .prompts.response_formatter_agent_prompt import RESPONSE_FORMATTER_AGENT_PROMPT
from .prompts.diagram_generation_prompt import DIAGRAM_GENERATION_PROMPT
from .prompts.diagram_query_generator import DIAGRAM_QUERY_GENERATOR_PROMPT
from .prompts.diagram_agent_prompt import DIAGRAM_AGENT_PROMPT
from .prompts.diagram_checker_agent_prompt import DIAGRAM_CHECKER_AGENT_PROMPT
from .prompts.chat_query_generator_agent_prompt import CHAT_QUERY_GENERATOR_AGENT_PROMPT
from .prompts.security_checker_agent_prompt import SECURITY_CHECKER_AGENT_PROMPT
from .prompts.diagram_typeDetector_agent_prompt import (
    DIAGRAM_TYPE_DETECTOR_AGENT_PROMPT,
)

# Diagram-specific prompt imports
from .prompts.flowchart_diagram_prompt import FLOWCHART_DIAGRAM_PROMPT
from .prompts.sequence_diagram_prompt import SEQUENCE_DIAGRAM_PROMPT
from .prompts.class_diagram_prompt import CLASS_DIAGRAM_PROMPT
from .prompts.state_diagram_prompt import STATE_DIAGRAM_PROMPT
from .prompts.er_diagram_prompt import ER_DIAGRAM_PROMPT
from .prompts.userJourney_diagram_prompt import USER_JOURNEY_DIAGRAM_PROMPT
from .prompts.gantt_diagram_prompt import GANTT_DIAGRAM_PROMPT
from .prompts.piechart_diagram_prompt import PIE_CHART_DIAGRAM_PROMPT
from .prompts.quadrant_chart_diagram_prompt import QUADRANT_CHART_DIAGRAM_PROMPT
from .prompts.requirement_diagram_prompt import REQUIREMENT_DIAGRAM_PROMPT
from .prompts.git_graph_diagram_prompt import GIT_GRAPH_DIAGRAM_PROMPT
from .prompts.c4_diagram_prompt import C4_DIAGRAM_PROMPT
from .prompts.mindmap_diagram_prompt import MINDMAP_DIAGRAM_PROMPT
from .prompts.timeline_diagram_prompt import TIMELINE_DIAGRAM_PROMPT
from .prompts.zenuml_diagram_prompt import ZENUML_DIAGRAM_PROMPT
from .prompts.sankey_diagram_prompt import SANKEY_DIAGRAM_PROMPT
from .prompts.xy_chart_diagram_prompt import XY_CHART_DIAGRAM_PROMPT
from .prompts.block_diagram_prompt import BLOCK_DIAGRAM_PROMPT
from .prompts.packet_diagram_prompt import PACKET_DIAGRAM_PROMPT
from .prompts.kanban_diagram_prompt import KANBAN_DIAGRAM_PROMPT
from .prompts.architecture_diagram_prompt import ARCHITECTURE_DIAGRAM_PROMPT
from .prompts.radar_diagram_prompt import RADAR_DIAGRAM_PROMPT


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
        "diagram_typeDetector_agent": DIAGRAM_TYPE_DETECTOR_AGENT_PROMPT,
    }

    # Mapping of diagram types to their specific prompts
    _DIAGRAM_TYPE_PROMPTS = {
        DiagramType.FLOWCHART.value: FLOWCHART_DIAGRAM_PROMPT,
        DiagramType.SEQUENCE.value: SEQUENCE_DIAGRAM_PROMPT,
        DiagramType.CLASS.value: CLASS_DIAGRAM_PROMPT,
        DiagramType.STATE.value: STATE_DIAGRAM_PROMPT,
        DiagramType.ENTITY_RELATIONSHIP.value: ER_DIAGRAM_PROMPT,
        DiagramType.USER_JOURNEY.value: USER_JOURNEY_DIAGRAM_PROMPT,
        DiagramType.GANTT.value: GANTT_DIAGRAM_PROMPT,
        DiagramType.PIE.value: PIE_CHART_DIAGRAM_PROMPT,
        DiagramType.QUADRANT_CHART.value: QUADRANT_CHART_DIAGRAM_PROMPT,
        DiagramType.REQUIREMENT.value: REQUIREMENT_DIAGRAM_PROMPT,
        DiagramType.GITGRAPH.value: GIT_GRAPH_DIAGRAM_PROMPT,
        DiagramType.C4.value: C4_DIAGRAM_PROMPT,
        DiagramType.MINDMAP.value: MINDMAP_DIAGRAM_PROMPT,
        DiagramType.TIMELINE.value: TIMELINE_DIAGRAM_PROMPT,
        DiagramType.ZENUML.value: ZENUML_DIAGRAM_PROMPT,
        DiagramType.SANKEY.value: SANKEY_DIAGRAM_PROMPT,
        DiagramType.XY_CHART.value: XY_CHART_DIAGRAM_PROMPT,
        DiagramType.BLOCK.value: BLOCK_DIAGRAM_PROMPT,
        DiagramType.PACKET.value: PACKET_DIAGRAM_PROMPT,
        DiagramType.KANBAN.value: KANBAN_DIAGRAM_PROMPT,
        DiagramType.ARCHITECTURE.value: ARCHITECTURE_DIAGRAM_PROMPT,
        DiagramType.RADAR.value: RADAR_DIAGRAM_PROMPT,
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

    @classmethod
    def get_diagram_prompt(cls, diagram_type: str) -> str:
        """
        Retrieve the specialized prompt for a specific diagram type.

        Args:
            diagram_type (str): The diagram type (e.g., 'flowchart', 'sequence')

        Returns:
            str: The specialized prompt for the diagram type

        Raises:
            KeyError: If the diagram type is not found
        """
        if diagram_type not in cls._DIAGRAM_TYPE_PROMPTS:
            raise KeyError(f"Prompt for diagram type '{diagram_type}' not found.")
        return cls._DIAGRAM_TYPE_PROMPTS[diagram_type]

    @classmethod
    def get_diagram_prompt_safe(cls, diagram_type: DiagramType) -> str:
        """
        Safely retrieve the specialized prompt for a diagram type with fallback.

        Args:
            diagram_type (str): The diagram type

        Returns:
            str: The specialized prompt or default diagram generation prompt
        """
        try:
            return cls.get_diagram_prompt(diagram_type.value)
        except KeyError:
            # Fallback to default diagram generation prompt
            return cls.get_prompt("diagram_generation_agent")

    @classmethod
    def get_available_diagram_types(cls) -> list[str]:
        """
        Get list of all available diagram types.

        Returns:
            list[str]: List of supported diagram type strings
        """
        return list(cls._DIAGRAM_TYPE_PROMPTS.keys())
