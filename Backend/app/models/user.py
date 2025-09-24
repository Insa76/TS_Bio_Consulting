from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String, default="client")  # client, admin, consultant
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    firebase_uid = Column(String, unique=True)