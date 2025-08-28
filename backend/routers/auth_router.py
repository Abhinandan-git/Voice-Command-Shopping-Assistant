from fastapi import APIRouter, HTTPException, status

from typing import Optional
from pydantic import BaseModel

from utils.password import hash_password, verify_password
from utils.database import register_user as register_user_to_database, get_user

router = APIRouter()

class UserCreate(BaseModel):
	email: str
	username: str
	password: str

class UserLogin(BaseModel):
	username: str
	password: str

@router.post("/register")
async def register_user(user: UserCreate) -> None:
	stored_user = get_user(email=user.email, username=user.username)
	if stored_user:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
	
	hashed_password = hash_password(user.password)
	
	register_user_to_database(user.email, user.username, hashed_password)

@router.post("/login")
async def login_user(user: UserLogin) -> None:
	stored_user = get_user(email=None, username=user.username)
	if not stored_user:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

	if not verify_password(user.password, stored_user["password"]):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
