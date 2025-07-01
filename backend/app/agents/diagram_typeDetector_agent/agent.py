# Standard Library Imports
# (No standard library imports in this file)

# Third-Party Imports
from google.adk.agents import LlmAgent

# Local Application Imports
from ..prompt_manager import PromptManager
from app.dto.diagram_type_dto import DiagramTypeDetectionResponse

# --- Define the Diagram Type Detector Agent ---
diagram_typeDetector_agent = LlmAgent(
    name="diagram_typeDetector_agent",
    instruction=PromptManager.get_prompt("diagram_typeDetector_agent"),
    description="Analyzes user queries to recommend the most appropriate diagram type from 22 supported options.",
    model="gemini-2.0-flash",
    output_key="diagram_type",
    output_schema=DiagramTypeDetectionResponse,
)

