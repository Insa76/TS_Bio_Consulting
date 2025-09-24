from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReportBase(BaseModel):
    content: str

class ReportCreate(ReportBase):
    pass

class ReportResponse(ReportBase):
    id: int
    audit_id: int
    generated_at: datetime

    class Config:
        from_attributes = True