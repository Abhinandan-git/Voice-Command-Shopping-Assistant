from typing import Optional, Dict
from bson.objectid import ObjectId

from pydantic import BaseModel

from pymongo import MongoClient
from pymongo.errors import InvalidURI, ConnectionFailure

# Import environment variables
from dotenv import load_dotenv
import os

load_dotenv()

# MongoDB URL loaded in .env file
uri = os.getenv("MONGO_URI", "")

# Create a new client and connect to the server
client = MongoClient(uri)

# Send a ping to confirm a successful connection
def connect_to_database() -> Optional[MongoClient]:
	print("Connecting to database...")
	try:
		client.admin.command("ping")
		print("Connection established.")
		return client
	# If any error is raised then print the error
	except (InvalidURI, ConnectionFailure) as e:
		print(e)

def register_user(email: str, username: str, password: str) -> Dict[str, str]:
	inserted_document = client.VoiceCommand.users.insert_one({"email": email, "name": username, "password": password})
	return {"user_id": str(inserted_document.inserted_id)}

def get_user(email: Optional[str], username: str) -> Optional[dict[str, str]]:
	if email:
		stored_user = client.VoiceCommand.users.find_one({"email": email})
	else:
		stored_user = client.VoiceCommand.users.find_one({"name": username})
	return stored_user
