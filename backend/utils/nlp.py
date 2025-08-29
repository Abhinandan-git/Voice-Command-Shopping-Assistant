import spacy

from typing import List, Optional, Dict

from utils.database import get_item_ids

# Load in the english model
nlp = spacy.load("en_core_web_sm")

action_to_endpoint = {
	"add": {"method": "POST", "url": "/inventory/add"},
	"remove": {"method": "DELETE", "url": "/inventory/remove"},
	"update": {"method": "PATCH", "url": "/inventory/update"},
}

def generate_tokens(command: str) -> List[str]:
	# Processing the command entered
	document = nlp(command)
	action, quantity, item = "", "", ""

	for word in document:
		# Add the action words
		action = word.lemma_ if word.pos_ == "VERB" else action
		# Add the quantity of the time
		quantity = word.lemma_ if word.pos_ == "NUM" else quantity
		# Add the item from the command
		item = word.lemma_ if word.pos_ == "NOUN" else item
	
	return [action, quantity, item]

def normalize_action(action: str) -> Optional[str]:
	# Map the words to its synonyms
	mapping = {
		"add": ["add", "insert", "include", "put"],
		"remove": ["remove", "delete", "discard", "take"],
		"update": ["update", "change", "modify", "increase", "decrease"]
	}

	# For each item check if mapping exists
	for key, synonyms in mapping.items():
		if action in synonyms:
			return key

def map_command(command: List[str]) -> Dict[str, str | Dict[str, str]]:
	method = "POST" if command[0] == "add" else "DELETE"

	return {"method": method, "url": f"/list{'/:id' if method == 'DELETE' else ''}", "payload": {command[2]: command[1]}}

def convert_to_action(command: str) -> Dict[str, str | Dict[str, str]]:
	generated_command = generate_tokens(command.strip().lower())

	normalized_action = normalize_action(generated_command[0])

	generated_command[0] = normalized_action if normalized_action else generated_command[0]

	return map_command(generated_command)

def get_item_id(payload) -> str:
	items = get_item_ids()
	for item in items:
		if item["name"].lower() in payload.keys():
			return str(item["_id"])
	return ""
