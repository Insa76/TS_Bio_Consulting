# schemas.py
from pydantic import BaseModel, EmailStr

class ContactCreate(BaseModel):
    nombre: str
    email: EmailStr
    organizacion: str
    servicio: str
    mensaje: str