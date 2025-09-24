# app/routers/chat.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid
from app.database.database import get_db
from app.models.chat_message import ChatMessage

router = APIRouter(prefix="/chat", tags=["chat"])

# Modelo para la solicitud
class MessageRequest(BaseModel):
    message: str
    session_id: str = None

# Guardar mensaje y obtener respuesta
@router.post("/message")
def save_chat_message(request: MessageRequest, db: Session = Depends(get_db)):
    session_id = request.session_id or str(uuid.uuid4())

    # Simulación de respuesta del bot (puedes conectarlo a Llama 3)
    bot_response = "Gracias por tu consulta. ¿En qué más puedo ayudarte?"

    # Guardar en DB
    db_message = ChatMessage(
        session_id=session_id,
        user_message=request.message,
        bot_response=bot_response
    )
    try:
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return {
            "session_id": session_id,
            "response": bot_response,
            "timestamp": db_message.created_at.isoformat()
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar el mensaje: {str(e)}")

# Obtener historial de chat
@router.get("/history")
def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at)
        .all()
    )
    return [
        {
            "user": m.user_message,
            "bot": m.bot_response,
            "time": m.created_at.isoformat()
        }
        for m in messages
    ]