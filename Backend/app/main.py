# main.py
import os
from dotenv import load_dotenv

# ✅ Cargar .env desde la raíz del proyecto
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.chat_message import ChatMessage

# Routers
from app.routers import auth, audits, ai, contact, chat, export
from app.routers.tasks import router as tasks_router
from app.routers.dashboard import router as dashboard_router
from app.routers.teams import router as teams_router


# Database
from app.database.database import engine
from app.database.base import Base


app = FastAPI(title="TS Bio Consulting API", version="1.0.0")

# CORS - Cambia ["*"] por dominios específicos en producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.1.12:5173", "https://ts-bio-consulting.vercel.app"],  # Solo frontend permitido
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear todas las tablas
Base.metadata.create_all(bind=engine)


# Incluir routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(audits.router, prefix="/audits", tags=["audits"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
app.include_router(contact.router, prefix="/contact", tags=["contact"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(tasks_router, prefix="/tasks", tags=["Tareas"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(teams_router, prefix="/teams", tags=["Equipos"])
app.include_router(export.router, prefix="/export", tags=["export"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido a TS Bio Consulting - API de Asesoría Médica con IA"}