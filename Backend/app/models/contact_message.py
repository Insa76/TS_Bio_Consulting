# models.py
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class ContactMessage(Base):
    __tablename__ = 'contact_messages'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    organizacion = Column(String(150), nullable=False)
    servicio = Column(String(100), nullable=False)
    mensaje = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)