# app/database/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Obtener URL de la base de datos
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Verificar que la URL exista
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("❌ DATABASE_URL no está definida en .env")

print(f"✅ Conectando a: {SQLALCHEMY_DATABASE_URL}")

# Crear motor de base de datos
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Importar Base desde base.py (evita conflictos de importación)
from .base import Base

# Función para obtener sesión
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()