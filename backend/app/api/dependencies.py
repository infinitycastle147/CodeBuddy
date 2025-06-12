from pymongo import MongoClient
from app.core.config import settings

def get_mongo_client():
    client = MongoClient(settings.MONGO_URI)
    return client