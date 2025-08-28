from typing import Optional

from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import InvalidURI, ConnectionFailure

# Import environment variables
from dotenv import load_dotenv
import os

load_dotenv()

# 
uri = os.getenv("MONGO_URI", "")

# Create a new client and connect to the server
client = MongoClient(uri)

# Send a ping to confirm a successful connection
def connect_to_database() -> Optional[Database]:
	print("Connecting to database...")
	try:
		client.admin.command("ping")
		print("Connection established.")
		return client.voicecommand
	# If any error is raised then print the error
	except (InvalidURI, ConnectionFailure) as e:
		print(e)
