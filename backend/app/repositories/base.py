"""
User Router
"""

from typing import Generic, TypeVar, Optional, List, Any
from bson import ObjectId
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from pydantic import BaseModel
from app.db.mongodb import async_find_one, async_find, async_insert_one, async_update_one, async_delete_one

ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository(Generic[ModelType]):
    """Base repository interface for database operations."""


    def __init__(self, mongo_client: MongoClient, database_name: str, collection_name: str):
        self.client = mongo_client
        self.database: Database = self.client[database_name]
        self.collection: Collection = self.database[collection_name]
        self.model_class: Optional[type[ModelType]] = None


    async def find_by_id(self, user_id: str) -> Optional[ModelType]:
        """Find a document by its ID."""

        if not ObjectId.is_valid(user_id):
            return None

        document: Optional[dict[str, Any]] = await async_find_one(self.collection, {"_id": ObjectId(user_id)})

        if document is not None:
            return self.model_class.model_dump(**document)

        return None


    async def find_all(self) -> List[ModelType]:
        """Find all documents in the collection."""
        documents = await async_find(self.collection, {})
        return [self.model_class.model_dump(**doc) for doc in documents]


    async def create(self, model: ModelType) -> ModelType:
        """Create a new document."""
        document = model.model_dump(by_alias=True)

        if "_id" in document and document["_id"] is None:
            del document["_id"]

        result = await async_insert_one(self.collection, document)
        return await self.find_by_id(str(result.inserted_id))


    async def update(self, user_id: str, model: ModelType) -> Optional[ModelType]:
        """Update an existing document with a full model."""
        if not ObjectId.is_valid(user_id):
            return None

        document = model.model_dump(exclude_unset=True, by_alias=True)
        if "_id" in document:
            del document["_id"]

        result = await async_update_one(
            self.collection,
            {"_id": ObjectId(user_id)},
            {"$set": document}
        )

        if result.modified_count == 0:
            return None

        return await self.find_by_id(user_id)


    async def update_fields(self, user_id: str, updates: dict) -> Optional[ModelType]:
        """Update specific fields of an existing document."""
        if not ObjectId.is_valid(user_id):
            return None

        # Remove _id if present
        updates_copy = updates.copy()
        if "_id" in updates_copy:
            del updates_copy["_id"]

        result = await async_update_one(
            self.collection,
            {"_id": ObjectId(user_id)},
            {"$set": updates_copy}
        )

        if result.modified_count == 0:
            return None

        return await self.find_by_id(user_id)


    async def delete(self, user_id: str) -> bool:
        """Delete a document by its ID."""

        if not ObjectId.is_valid(user_id):
            return False

        result = await async_delete_one(self.collection, {"_id": ObjectId(user_id)})
        return result.deleted_count > 0
