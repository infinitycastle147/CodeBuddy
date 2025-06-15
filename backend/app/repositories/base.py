from typing import Generic, TypeVar, Optional, List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pydantic import BaseModel

ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository(Generic[ModelType]):
    """Base repository interface for database operations."""
    
    def __init__(self, mongo_client: AsyncIOMotorClient, database_name: str, collection_name: str):
        self.client = mongo_client
        self.database: AsyncIOMotorDatabase = self.client[database_name]
        self.collection = self.database[collection_name]
        self.model_class: type[ModelType] = None  # Will be set by child classes

    async def find_by_id(self, id: str) -> Optional[ModelType]:
        """Find a document by its ID."""
        if not ObjectId.is_valid(id):
            return None
        document = await self.collection.find_one({"_id": ObjectId(id)})
        return self.model_class(**document) if document else None

    async def find_all(self) -> List[ModelType]:
        """Find all documents in the collection."""
        cursor = self.collection.find()
        documents = await cursor.to_list(length=None)
        return [self.model_class(**doc) for doc in documents]

    async def create(self, model: ModelType) -> ModelType:
        """Create a new document."""
        document = model.model_dump(exclude_unset=True, by_alias=True)
        if "_id" in document and document["_id"] is None:
            del document["_id"]
        result = await self.collection.insert_one(document)
        return await self.find_by_id(str(result.inserted_id))

    async def update(self, id: str, model: ModelType) -> Optional[ModelType]:
        """Update an existing document."""
        if not ObjectId.is_valid(id):
            return None
        document = model.model_dump(exclude_unset=True, by_alias=True)
        if "_id" in document:
            del document["_id"]
        result = await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": document}
        )
        if result.modified_count == 0:
            return None
        return await self.find_by_id(id)

    async def delete(self, id: str) -> bool:
        """Delete a document by its ID."""
        if not ObjectId.is_valid(id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0