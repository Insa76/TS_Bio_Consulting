# app/routers/contact.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.contact_message import ContactMessage
from pydantic import BaseModel

router = APIRouter(tags=["contact"])

class ContactForm(BaseModel):
    nombre: str
    email: str
    organizacion: str
    servicio: str
    mensaje: str

@router.post("/")
def create_contact(
    form_data: ContactForm,  # ✅ Así se declara: nombre: Tipo
    db: Session = Depends(get_db)
):
    try:
        db_message = ContactMessage(**form_data.dict())
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return {"message": "Consulta recibida. Nos contactaremos pronto."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar: {str(e)}")

    