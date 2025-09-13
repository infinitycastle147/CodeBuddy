from typing import Generic, TypeVar, Optional, Any, Dict, Union
from pydantic import BaseModel
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse

DataT = TypeVar('DataT')


def create_response(*, success: bool = True, message: str, data: Any = None, status_code: int = status.HTTP_200_OK) -> Union[Dict, JSONResponse]:
    """Create a standardized success response."""
    response_content = {
        "success": success,
        "message": message,
        "data": data
    }
    
    return response_content

def create_error_response(*, code: str, message: str, details: Any = None, status_code: int = status.HTTP_400_BAD_REQUEST) -> Union[Dict, JSONResponse]:
    """Create a standardized error response."""
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