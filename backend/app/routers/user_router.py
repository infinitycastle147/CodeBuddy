"""
User Router
"""

from fastapi import APIRouter, Depends, status, Path
from typing import Annotated
from app.models.user import User
from app.dto.user_dto import UserResponseDto
from app.repositories.implementations import UserRepository
from app.dependencies.dependencies import get_user_repository
from app.core.responses import create_response, create_error_response
from app.auth.authorization import require_same_user
from pydantic import EmailStr

router = APIRouter(prefix="/user",tags=["user"])


@router.get(
    "/health",
    summary="Health Check",
    description="Check if the user router is healthy and responding.",
)
def health_check() -> dict:
    """Perform a health check on the user router."""
    return create_response(message="User router is healthy", success=True)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Create User",
    description="Create a new user in the system.",
    responses={
        201: {"description": "User created successfully"},
        409: {"description": "User with this email already exists"},
        500: {"description": "Internal server error"},
    },
)
async def create_user(
    user: User, 
    user_repo: Annotated[UserRepository, Depends(get_user_repository)]
) -> dict:
    """
    Create a new user in the system.

    Parameters:
        user (User): The user data to create.
        user_repo (UserRepository): The user repository dependency.

    Returns:
        UserResponse: The created user data.

    Raises:
        HTTPException: If user with the same email already exists or if there's a server error.
    """
    try:
        # Check if user already exists
        existing_user = await user_repo.find_by_email(str(user.email))

        if existing_user:
            return create_error_response(
                code="user_exists",
                message="User with this email already exists",
                status_code=status.HTTP_409_CONFLICT,
            )

        # Create new user
        new_user: User = await user_repo.create(user)
        user_response = UserResponseDto.from_odm(new_user)
        new_user = user_response.model_dump(by_alias=True)

        return create_response(message="User created successfully", data=new_user)
    except Exception as e:
        return create_error_response(
            code="create_user_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get(
    "/{user_id}",
    summary="Get User",
    description="Get a user by their ID. Users can only access their own data.",
    responses={
        200: {"description": "User retrieved successfully"},
        403: {"description": "Access denied"},
        404: {"description": "User not found"},
        500: {"description": "Internal server error"},
    },
)
async def get_user(
    current_user: Annotated[User, Depends(require_same_user)],
    user_id: str = Path(..., description="The ID of the user to retrieve"),
) -> dict:
    """
    Get a user by their ID. Users can only access their own data.

    Parameters:
        user_id (str): The ID of the user to retrieve.
        current_user (User): The authenticated user (validated for ownership).

    Returns:
        UserResponse: The user data.

    Raises:
        HTTPException: If access denied or server error.
    """
    try:
        user_response = UserResponseDto.from_odm(current_user)
        user = user_response.model_dump(by_alias=True)

        if user.get(user_id) != user_id:
            return create_error_response(
                code="403",
                message="User with this ID doesn't exist",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        return create_response(message="User retrieved successfully", data=user)
    except Exception as e:
        return create_error_response(
            code="get_user_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get(
    "/",
    summary="List Users",
    description="Get a list of all users in the system.",
    responses={
        200: {"description": "Users retrieved successfully"},
        500: {"description": "Internal server error"},
    },
)
async def list_users(
    user_repo: Annotated[UserRepository, Depends(get_user_repository)]
) -> dict:
    """
    Get a list of all users in the system.

    Parameters:
        user_repo (UserRepository): The user repository dependency.

    Returns:
        List[UserResponse]: A list of all users.

    Raises:
        HTTPException: If there's a server error.
    """
    try:
        users = await user_repo.find_all()
        if not users:
            return create_response(message="No users found", data=[])

        users = [UserResponseDto.from_odm(user).model_dump(by_alias=True) for user in users]
        return create_response(message="Users retrieved successfully", data=users)
    except Exception as e:
        return create_error_response(
            code="list_users_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get(
    "/email/{email}",
    summary="Get User by Email",
    description="Get a user by their email address.",
    responses={
        200: {"description": "User retrieved successfully"},
        404: {"description": "User not found"},
        500: {"description": "Internal server error"},
    },
)
async def get_user_by_email(
    user_repo: Annotated[UserRepository, Depends(get_user_repository)],
    email: EmailStr = Path(
        ..., description="The email address of the user to retrieve"
    ),
) -> dict:
    """
    Get a user by their email address.

    Parameters:
        email (EmailStr): The email address of the user to retrieve.
        user_repo (UserRepository): The user repository dependency.

    Returns:
        UserResponse: The user data.

    Raises:
        HTTPException: If user is not found or if there's a server error.
    """
    try:
        user = await user_repo.find_by_email(str(email))

        if not user:
            return create_error_response(
                code="user_not_found",
                message="User not found",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        user_response = UserResponseDto.from_odm(user)
        user = user_response.model_dump(by_alias=True)
        return create_response(message="User retrieved successfully", data=user)

    except Exception as e:
        return create_error_response(
            code="get_user_by_email_error",
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
