from fastapi import APIRouter
from app.schemas.user import UserCreate, UserLogin
from app.controllers.auth_controller import signup_user, login_user

router = APIRouter()

@router.post("/register")
def register(user: UserCreate):
    return signup_user(
        email=user.email,
        password=user.password,
        username=user.username,
        role=user.role,
        is_active=user.is_active
    )

@router.post("/login")
def login(user: UserLogin):
    return login_user(user.email, user.password)