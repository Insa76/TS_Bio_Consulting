# app/models/task.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime
from app.database.base import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audits.id"), nullable=False)
    action = Column(Text, nullable=False)
    responsible = Column(String(150), nullable=False)
    responsible_email = Column(String(255), nullable=True)  # ← Nuevo campo
    deadline = Column(DateTime, nullable=False)
    status = Column(String(50), default="Pendiente")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)