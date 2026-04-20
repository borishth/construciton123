from fastapi import HTTPException, status
from app.db import get_connection
from app.core.security import hash_password, verify_password

import uuid

def signup_user(email: str, password: str, username: str, role: str, is_active: bool):
    conn = get_connection()
    cur = conn.cursor()

    # Check if email is already registered
    cur.execute("SELECT id FROM login_auth WHERE email = %s", (email,))
    if cur.fetchone():
        cur.close()
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account is already registered. Please sign in instead."
        )

    hashed_pw = hash_password(password)
    user_id = str(uuid.uuid4())

    cur.execute(
        "INSERT INTO login_auth (id, email, password_hash, role, is_active, username) VALUES (%s, %s, %s, %s, %s, %s)",
        (user_id, email, hashed_pw, role, is_active, username)
    )
    conn.commit()

    cur.close()
    conn.close()

    return {"success": True, "message": "User created successfully"}


def login_user(email: str, password: str):
    conn = get_connection()
    cur = conn.cursor()

    # We now fetch 'username' but only filter by email
    cur.execute(
        "SELECT id, email, password_hash, role, is_active, username FROM login_auth WHERE email = %s",
        (email,)
    )
    user = cur.fetchone()

    cur.close()
    conn.close()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="sorry ur identification is wrong please try again letter"
        )

    try:
        if not verify_password(password, user[2]):
            # Fallback for plain-text passwords (as requested by user)
            if password != user[2]:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="sorry ur identification is wrong please try again letter"
                )
    except Exception as e:
        # If hash identification fails, check if it matches plain text
        if password != user[2]:
            print(f"Password verification failed (Hash and Plain): {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="sorry ur identification is wrong please try again letter"
            )

    if not user[4]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account inactive"
        )

    return {
        "success": True,
        "message": "Login success",
        "user": {
            "id": str(user[0]),
            "email": user[1],
            "role": user[3],
            "username": user[5]
        }
    }