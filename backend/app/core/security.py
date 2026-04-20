def hash_password(password: str) -> str:
    # Storing the password exactly as created (plain-text)
    return password

def verify_password(password: str, stored_password: str) -> bool:
    # Checking the exact match of the plain-text password
    return password == stored_password