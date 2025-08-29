from fastapi import APIRouter, HTTPException, status

from typing import Optional, Dict
from bson.objectid import ObjectId
from pydantic import BaseModel

from utils.password import hash_password, verify_password
from utils.database import register_user as register_user_to_database, get_user

router = APIRouter()

class User(BaseModel):
	email: Optional[str]
	username: str
	password: str

@router.post("/register")
async def register_user(user: User) -> Dict[str, str]:
	if not user.email:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email required")

	stored_user = get_user(email=user.email, username=user.username)
	if stored_user:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

	hashed_password = hash_password(user.password)
	
	return register_user_to_database(user.email, user.username, hashed_password)

@router.post("/login")
async def login_user(user: User) -> Dict[str, str]:
	stored_user = get_user(email=None, username=user.username)

	# Checking if the user of the same username exists or not
	if not stored_user:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

	# Verify the password after getting stored user
	if not verify_password(user.password, stored_user["password"]):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

	return {"user_id": str(stored_user.get("_id", ""))}
