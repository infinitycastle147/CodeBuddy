# Standard Library Imports
from typing import List, Optional

# Third-Party Imports
from pydantic import BaseModel, Field


class DiagramValidationOutput(BaseModel):
    """
    Output schema for diagram_checker_agent to ensure structured validation results.
    
    This schema enforces consistent output format for diagram validation,
    making it easier to programmatically handle validation results.
    """
    
    is_valid: bool = Field(
        description="Whether the diagram passes all validation checks"
    )
    
    corrected_diagram: Optional[str] = Field(
        default=None,
        description="Corrected Mermaid diagram code if modifications were made"
    )
    
    validation_status: str = Field(
        description="Overall validation status: 'valid', 'corrected', or 'invalid'"
    )
    
    syntax_errors: List[str] = Field(
        default_factory=list,
        description="List of syntax errors found in the diagram"
    )
    
    logical_issues: List[str] = Field(
        default_factory=list,
        description="List of logical inconsistencies or structural issues"
    )
    
    best_practice_suggestions: List[str] = Field(
        default_factory=list,
        description="Suggestions for improving diagram quality and readability"
    )
    
    explanation: str = Field(
        description="Human-readable explanation of validation results and changes made"
    )