from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import User, UserResponse
from app.repositories.implementations import UserRepository
from app.api.dependencies import get_user_repository
from app.core.responses import create_response, create_error_response
from pydantic import EmailStr
from typing import List

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/health")
def health_check():
    return create_response(message="User router is healthy")

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: User,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Create a new user."""
    try:
        # Check if user already exists
        existing_user = await user_repo.find_by_email(user.email)
        if existing_user:
            return create_error_response(
                code="user_exists",
                message="User with this email already exists",
                status_code=status.HTTP_409_CONFLICT
            )
        
        # Create new user
        new_user = await user_repo.create(user.dict(by_alias=True))
        return create_response(
            message="User created successfully",
            data=new_user
        )
    except Exception as e:
        return create_error_response(
            code="create_user_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Get user by ID."""
    try:
        user = await user_repo.find_by_id(user_id)
        if not user:
            return create_error_response(
                code="user_not_found",
                message="User not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        return create_response(
            message="User retrieved successfully",
            data=user
        )
    except Exception as e:
        return create_error_response(
            code="get_user_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@router.get("/", response_model=List[UserResponse])
async def list_users(
    user_repo: UserRepository = Depends(get_user_repository)
):
    """List all users."""
    try:
        users = await user_repo.find_all()
        return create_response(
            message="Users retrieved successfully",
            data=users
        )
    except Exception as e:
        return create_error_response(
            code="list_users_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@router.get("/email/{email}", response_model=UserResponse)
async def get_user_by_email(
    email: EmailStr,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Get user by email."""
    try:
        user = await user_repo.find_by_email(email)
        if not user:
            return create_error_response(
                code="user_not_found",
                message="User not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        return create_response(
            message="User retrieved successfully",
            data=user
        )
    except Exception as e:
        return create_error_response(
            code="get_user_by_email_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

