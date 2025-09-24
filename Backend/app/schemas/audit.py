from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AuditBase(BaseModel):
    score: int
    answers: dict

class AuditCreate(AuditBase):
    pass

class AuditResponse(AuditBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # 👈 Esencial para SQLAlchemy 2.0