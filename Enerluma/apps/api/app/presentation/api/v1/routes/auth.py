from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.auth.security import create_access_token, get_current_user, get_password_hash, verify_password
from app.core.database import get_db
from app.infrastructure.models.user_model import UserModel
from app.presentation.schemas.auth import TokenResponse, UserRegisterRequest, UserResponse

router = APIRouter()


@router.post("/auth/register", response_model=UserResponse)
def register(payload: UserRegisterRequest, db: Session = Depends(get_db)) -> UserResponse:
    existing = db.query(UserModel).filter(UserModel.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    user = UserModel(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(id=user.id, email=user.email, full_name=user.full_name)


@router.post("/auth/token", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(user.email)
    return TokenResponse(access_token=token)


@router.get("/auth/me", response_model=UserResponse)
def me(current_user: UserModel = Depends(get_current_user)) -> UserResponse:
    return UserResponse(id=current_user.id, email=current_user.email, full_name=current_user.full_name)
