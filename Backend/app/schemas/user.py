from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: str
    role: str = "client"           # client, admin, consultant
    organization: Optional[str] = None  # Ej: "Clínica Medilife"

class UserCreate(UserBase):
    firebase_uid: str  # UID único de Firebase Authentication

class UserResponse(UserBase):
    id: int
    created_at: str

    class Config:
        from_attributes = True  # 👈 Para mapear modelos SQLAlchemy