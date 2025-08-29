from typing import Optional, Dict
from bson.objectid import ObjectId

from pydantic import BaseModel

from pymongo import MongoClient, CursorType
from pymongo.errors import InvalidURI, ConnectionFailure

from bson.objectid import ObjectId

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

def get_items() -> List[Dict[str, str | int | bool | List[str]]]:
	items = client.VoiceCommand.products.find()
	item_list = []

	for item in items:
		print(item)
		item_list.append({
			"id": str(item["_id"]),
			"name": item["name"],
			"category": item["category"],
			"price": item["price"],
			"seasonal": item["seasonal"],
			"alternatives": item["alternatives"]
		})

	return item_list

def get_user_userid(user_id: str):
	return client.VoiceCommand.users.find_one({"_id": ObjectId(user_id)})

def update_user(user):
	return client.VoiceCommand.users.update_one({"_id": user["_id"]}, {"$set": {"items": user["items"]}})
