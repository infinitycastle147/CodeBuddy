from fastapi import Request, HTTPException
from cryptography.fernet import Fernet
from typing import TypeVar, Optional
from pydantic import BaseModel
from settings import settings

class SetupData(BaseModel):
    github: Optional[dict] = {
        'token': str,
        'username': str
    }
    jira: Optional[dict] = {
        'url': str,
        'apiToken': str,
        'username': str,
        'projectKey': str
    }
    aiModel: Optional[dict] = {
        'name': str,
        'token': str
    }

class CredentialDecryptor:
    def __init__(self):
        self.fernet = Fernet(settings.encryption_key.encode())

    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt encrypted credentials."""
        try:
            return self.fernet.decrypt(encrypted_data.encode()).decode()
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail="Failed to decrypt credentials"
            )

async def decrypt_credentials_middleware(request: Request, call_next):
    """Middleware to decrypt credentials in request body."""
    try:
        # Get the original request body
        body = await request.body()
        if body:
            # Parse the request body
            json_body = await request.json()
            
            # Initialize decryptor
            decryptor = CredentialDecryptor()
            
            # Decrypt credentials if present
            if 'github' in json_body and json_body['github'].get('token'):
                json_body['github']['token'] = decryptor.decrypt(json_body['github']['token'])
                
            if 'jira' in json_body:
                if json_body['jira'].get('apiToken'):
                    json_body['jira']['apiToken'] = decryptor.decrypt(json_body['jira']['apiToken'])
                    
            if 'aiModel' in json_body and json_body['aiModel'].get('token'):
                json_body['aiModel']['token'] = decryptor.decrypt(json_body['aiModel']['token'])
            
            # Modify request state to include decrypted data
            request.state.credentials = SetupData(**json_body)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process credentials: {str(e)}"
        )
    
    # Continue with the request
    response = await call_next(request)
    return response