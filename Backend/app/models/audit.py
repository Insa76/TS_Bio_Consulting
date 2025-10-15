# app/models/audit.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime
from app.database.base import Base
from sqlalchemy.orm import relationship

class Audit(Base):
    __tablename__ = "audits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    answers = Column(Text, nullable=False)
    report = Column(Text, nullable=True)
    status = Column(String(50), default="Generado")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relación inversa con Report
    report = relationship("Report", back_populates="audit", uselist=False)  # ✅ Uselist=False = 1:1