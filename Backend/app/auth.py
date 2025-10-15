# app/auth.py
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from app.database.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User

SECRET_KEY = "your-super-secret-jwt-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ✅ Token fake que usas en el frontend
FAKE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJlbWFpbCI6InRhbmNhZG1pbmlzdHJhdG9yQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6NDg1MjM0NTYwMH0.fake-signature"


def verify_token(token: str) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    if not token:
        raise HTTPException(status_code=401, detail="Token no proporcionado")

    # ✅ Modo desarrollo: aceptar token fake
    if os.getenv("ENV") == "development" and token == "fake-jwt-token-123":
        return User(
            id=1,
            name="Administrador",
            email="tania@admin.com",
            role="admin",
            organization="TS Bio Consulting"
        )

    # 🔒 En producción, aquí iría la validación real (más adelante)
    raise HTTPException(status_code=401, detail="Token inválido")