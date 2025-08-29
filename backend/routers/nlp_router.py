from fastapi import APIRouter

from typing import Dict

# Importing utility functions
from utils.nlp import convert_to_action

router = APIRouter()

# The `cmd` route refers to the text command
@router.post("/cmd")
def text_to_action(command: str) -> Dict[str, str | Dict[str, str]]:
	action = convert_to_action(command)

	return {"method": action["method"], "url": action["url"], "payload": action["payload"]}
