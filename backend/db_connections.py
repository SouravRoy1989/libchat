import asyncio
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
import os 
from dotenv import load_dotenv

load_dotenv()

# Database and Collection names are now defined as constants

DB_NAME = "librechat_db"
COLLECTION_NAME = "users"

async def get_user_collection(db_url: str, ) -> AsyncIOMotorCollection:
    """
    Establishes an async connection to MongoDB using only a connection string.
    It checks for the existence of the 'librechat_db' database and 'users'
    collection, and returns the collection object ready for use.

    MongoDB creates databases and collections lazily on the first write operation.
    This function checks if they exist *before* any potential write.

    
    """
    print(f"Attempting to connect to MongoDB at {db_url}...")
    # 1. Create the client
    client = AsyncIOMotorClient(db_url)

    try:
        # The ismaster command is cheap and does not require auth. It's a good way
        # to verify that the server is responding.
        await client.admin.command('ismaster')
        print(" MongoDB connection successful.")
    except Exception as e:
        
        print(f"   Error: {e}")
        return None # Return None on connection failure

    # 2. Check if the database exists
    existing_dbs = await client.list_database_names()
    if DB_NAME in existing_dbs:
        print(f"Database '{DB_NAME}' already exists.")
    else:
        # Note: The database will only be physically created on the first write.
        print(f"Database '{DB_NAME}' not found. It will be created upon first data insertion.")

    # 3. Get the database object (this works even if the DB doesn't exist yet)
    database = client[DB_NAME]

    # 4. Check if the collection exists within the database
    existing_collections = await database.list_collection_names()
    if COLLECTION_NAME in existing_collections:
        print(f"Collection '{COLLECTION_NAME}' already exists in '{DB_NAME}'.")
    else:
        # Note: The collection will only be physically created on the first write.
        print(f"Collection '{COLLECTION_NAME}' not found. It will be created upon first data insertion.")

    # 5. Get the collection object and return it

    user_collection = database.get_collection(COLLECTION_NAME)
    print(f"-> Returning collection object for '{DB_NAME}.{COLLECTION_NAME}'.")
    return user_collection


