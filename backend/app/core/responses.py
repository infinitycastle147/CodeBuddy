from typing import Generic, TypeVar, Optional, Any, Dict, Union
from pydantic import BaseModel
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse

DataT = TypeVar('DataT')

class ResponseModel(BaseModel, Generic[DataT]):
    """Standard response model for all API endpoints."""
    success: bool
    message: str
    data: Optional[DataT] = None

class ErrorDetail(BaseModel):
    """Detailed error information."""
    code: str
    message: str
    details: Optional[Any] = None

class ErrorResponse(BaseModel):
    """Standard error response model."""
    success: bool = False
    error: ErrorDetail

def create_response(*, success: bool = True, message: str, data: Any = None, status_code: int = status.HTTP_200_OK) -> Union[Dict, JSONResponse]:
    """Create a standardized success response.
    
    Args:
        success: Whether the operation was successful
        message: A message describing the result
        data: The data to return
        status_code: HTTP status code to return
        
    Returns:
        A dictionary or JSONResponse with the standardized response format
    """
    response_content = {
        "success": success,
        "message": message,
        "data": data
    }
    
    # If status code is not 200, return a JSONResponse with the appropriate status code
    if status_code != status.HTTP_200_OK:
        return JSONResponse(content=response_content, status_code=status_code)
    
    return response_content

def create_error_response(*, code: str, message: str, details: Any = None, status_code: int = status.HTTP_400_BAD_REQUEST) -> Union[Dict, JSONResponse]:
    """Create a standardized error response.
    
    Args:
        code: An error code identifying the type of error
        message: A message describing the error
        details: Additional details about the error
        status_code: HTTP status code to return
        
    Returns:
        A dictionary or JSONResponse with the standardized error response format
    """
    response_content = {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "details": details
        }
    }
    
    # Return a JSONResponse with the appropriate status code
    return JSONResponse(content=response_content, status_code=status_code)

def http_exception_handler(status_code: int, code: str, message: str, details: Any = None) -> HTTPException:
    """Create an HTTPException with a standardized error response.
    
    Args:
        status_code: HTTP status code to return
        code: An error code identifying the type of error
        message: A message describing the error
        details: Additional details about the error
        
    Returns:
        An HTTPException with the standardized error response format
    """
    return HTTPException(
        status_code=status_code,
        detail={
            "success": False,
            "error": {
                "code": code,
                "message": message,
                "details": details
            }
        }
    )