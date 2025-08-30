from fastapi import APIRouter

from typing import Dict

# Importing utility functions
from utils.nlp import convert_to_action, get_item_id
from routers.crud_router import delete_item, add_item

router = APIRouter()

# The `cmd` route refers to the text command
@router.post("/cmd")
def text_to_action(command: str, user_id: str) -> Dict[str, str | Dict[str, str]]:
	action = convert_to_action(command)

	item_id = get_item_id(action["payload"])

	delete_item(user_id, item_id) if action["method"] == "DELETE" else add_item(user_id, item_id)

	return {"method": action["method"], "url": action["url"], "payload": action["payload"]}
