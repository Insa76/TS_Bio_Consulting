# app/schemas/task.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    action: str
    responsible: str
    responsible_email: Optional[str] = None  # ← Asegúrate de que esté aquí
    deadline: datetime
    status: str = "Pendiente"

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    audit_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True