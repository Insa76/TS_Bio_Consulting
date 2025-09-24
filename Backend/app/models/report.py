from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.database import Base
from app.models.audit import Audit
from sqlalchemy.orm import relationship

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audits.id"), unique=True)
    content = Column(Text)  # HTML generado por IA
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relación con Audit
    audit = relationship("Audit", back_populates="report")