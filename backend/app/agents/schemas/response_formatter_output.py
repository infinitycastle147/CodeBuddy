# Standard Library Imports
from typing import List, Optional

# Third-Party Imports
from pydantic import BaseModel, Field


class CodeSnippet(BaseModel):
    """
    Represents a code snippet with metadata for proper rendering.
    """
    
    file_path: str = Field(
        description="Full path to the source file"
    )
    
    code: str = Field(
        description="The actual code content"
    )
    
    language: str = Field(
        description="Programming language for syntax highlighting"
    )
    
    start_line: Optional[int] = Field(
        default=None,
        description="Starting line number in the original file"
    )
    
    end_line: Optional[int] = Field(
        default=None,
        description="Ending line number in the original file"
    )


class Source(BaseModel):
    """
    Represents a source used to generate the response.
    """
    
    file_path: str = Field(
        description="Path to the source file"
    )
    
    relevance_score: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Relevance score of this source to the query"
    )
    
    chunk_id: Optional[str] = Field(
        default=None,
        description="Identifier for the specific chunk or section"
    )


class FormattedResponse(BaseModel):
    """
    Output schema for response_formatter_agent to ensure structured chat responses.
    
    This schema standardizes the format of chat responses, enabling better
    frontend rendering and programmatic handling of different content types.
    """
    
    formatted_content: str = Field(
        description="Main markdown-formatted response content"
    )
    
    code_snippets: List[CodeSnippet] = Field(
        default_factory=list,
        description="List of code snippets with metadata for rendering"
    )
    
    mermaid_diagrams: List[str] = Field(
        default_factory=list,
        description="List of Mermaid diagram codes for visualization"
    )
    
    key_insights: List[str] = Field(
        default_factory=list,
        description="Bullet points highlighting main findings or insights"
    )
    
    relevant_files: List[str] = Field(
        default_factory=list,
        description="List of file paths referenced in the response"
    )
    
    confidence_score: float = Field(
        default=0.8,
        ge=0.0,
        le=1.0,
        description="Confidence score (0.0-1.0) in response accuracy"
    )
    
    response_type: str = Field(
        description="Type of response: 'code_explanation', 'tutorial', 'troubleshooting', 'api_docs', etc."
    )
    
    sources: List[Source] = Field(
        default_factory=list,
        description="List of sources used to generate the response with metadata"
    )