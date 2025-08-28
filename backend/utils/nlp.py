import spacy

from typing import List, Optional, Dict

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

def convert_to_action(command: str) -> Dict[str, object]:
	return {"method": {}, "url": {}, "payload": {}}