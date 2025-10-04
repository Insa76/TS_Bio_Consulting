# app/schemas/team.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from .user import UserBase

class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(TeamBase):
    pass

class TeamResponse(TeamBase):
    id: int
    created_at: datetime
    updated_at: datetime

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime    

    class Config:
        from_attributes = True