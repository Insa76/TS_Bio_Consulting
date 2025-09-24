# main.py
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.chat_message import Base as ChatBase

# Routers
from app.routers import auth, audits, ai, contact, chat


# Database
from app.database.database import engine
from app.database.base import Base


app = FastAPI(title="TS Bio Consulting API", version="1.0.0")

# CORS - Cambia ["*"] por dominios específicos en producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Solo frontend permitido
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear todas las tablas
Base.metadata.create_all(bind=engine)
ChatBase.metadata.create_all(bind=engine)

# Incluir routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(audits.router, prefix="/audits", tags=["audits"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
app.include_router(contact.router, prefix="/contact", tags=["contact"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido a TS Bio Consulting - API de Asesoría Médica con IA"}