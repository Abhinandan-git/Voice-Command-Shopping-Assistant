from fastapi import APIRouter

# Importing utility functions
from utils.nlp import convert_to_action

router = APIRouter()

# The `cmd` route refers to the text command
@router.post("/cmd")
def text_to_action(command: str) -> None:
	(method, url, payload) = convert_to_action(command)
