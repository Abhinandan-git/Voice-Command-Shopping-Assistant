from fastapi import APIRouter
from typing import List, Dict

from utils.database import get_items, get_user_userid, update_user

router = APIRouter()

@router.get("/")
def get_all_products() -> List[Dict[str, str | int | bool | List[str]]]:
	return get_items()

@router.post("/list")
def add_item(user_id: str, item_id: str):
	user = get_user_userid(user_id)
	if not user:
		exit(-1)

	user["items"].append(item_id)
	
	update_user(user)

	return {"details": "Update successful"}
