# app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="client")
    organization = Column(String(255))
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)