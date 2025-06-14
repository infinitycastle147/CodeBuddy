from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/health")
def health_check():
    return {"message": "User router is healthy", "status": "ok"}, 200

