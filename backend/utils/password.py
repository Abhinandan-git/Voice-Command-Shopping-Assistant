import hashlib

def hash_password(password: str) -> str:
	hashed_password = hashlib.sha256(password.encode("utf-8")).hexdigest()
	return hashed_password

def verify_password(plain_password: str, hashed_password: str) -> bool:
	print(hashlib.sha256(plain_password.encode("utf-8")).hexdigest(), hashed_password)
	return hashlib.sha256(plain_password.encode("utf-8")).hexdigest() == hashed_password
