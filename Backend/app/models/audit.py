from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.database import Base

class Audit(Base):
    __tablename__ = "audits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    answers = Column(JSON)  # Ej: {"q1": "yes", "q2": "no", ...}
    score = Column(Integer)  # 0-100
    status = Column(String, default="pending")  # pending, completed, reviewed
    generated_report = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())