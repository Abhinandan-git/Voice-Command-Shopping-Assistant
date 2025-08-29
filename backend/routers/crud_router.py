from fastapi import APIRouter
from typing import List, Dict

from utils.database import get_items, get_user_userid, update_user

router = APIRouter()

@router.get("/products")
def get_all_products() -> List[Dict[str, str | float | bool]]:
	return get_items()

@router.post("/list")
def add_item(user_id: str, item_id: str):
	user = get_user_userid(user_id)
	if not user:
		exit(-1)

	user["items"].append(item_id)
	
	update_user(user)

	return {"details": "Update successful"}

@router.delete("/list")
def delete_item(user_id: str, item_id: str):
	user = get_user_userid(user_id)
	if not user:
		exit(-1)
	
	user["items"].remove(item_id)

	update_user(user)

	return {"details": "Update successful"}
