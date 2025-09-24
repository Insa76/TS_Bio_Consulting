# app/models/chat_message.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class ChatMessage(Base):
    __tablename__ = 'chat_messages'

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(50), nullable=False)
    user_message = Column(Text, nullable=False)
    bot_response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)