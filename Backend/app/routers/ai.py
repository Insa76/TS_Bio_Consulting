# app/routers/ai.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict
from app.database.database import get_db
from app.crud.audit import get_audit_by_id
from app.ai.generate_report import generate_audit_report
from app.ai.legal_chatbot import ask_legal_question
from app.models.user import User
from app.auth import get_current_user
from app.ai import kb
from pydantic import BaseModel
import requests
from app.models.audit import Audit

router = APIRouter(tags=["ai"])

class SearchQuery(BaseModel):
    query: str

@router.post("/chat")
def chat(question: Dict[str, str], current_user: User = Depends(get_current_user)):
    q = question.get("question", "")
    if not q:
        raise HTTPException(status_code=400, detail="Pregunta vacía")
    try:
        answer = ask_legal_question(q)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en IA: {str(e)}")

@router.get("/report/{audit_id}")
def generate_ai_report(
    audit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Buscar la auditoría
    audit = db.query(Audit).filter(Audit.id == audit_id, Audit.user_id == current_user.id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Auditoría no encontrada o no autorizada")

    # 2. Preparar respuestas
    answers = "\n".join([f"{q}: {a}" for q, a in audit.answers.items()])

    # 3. Prompt claro y estructurado
    prompt = f"""
Eres un consultor médico especializado en auditorías sanitarias argentinas.
Basado en las siguientes respuestas de una autoevaluación, genera un informe profesional en HTML (sin <html> ni <body>).

INFORME:
Incluye:
- Un título claro
- Hallazgos principales (positivos y críticos)
- Nivel general de cumplimiento: X%
- Brechas críticas (máximo 5): con nombre de norma y riesgo (Alta/Media/Baja)
- Recomendaciones: Acciones específicas con plantillas descargables
- Nota final: “Este informe fue generado por TS Bio Consulting AI. No sustituye asesoría legal.”

Preguntas y respuestas:
{answers}

Normativas clave:
- Ley 26.529: Derechos del Paciente
- Ley 25.916: Gestión de Residuos
- ANMAT: Regulación de productos sanitarios
- NOM-004: Higiene y seguridad
- Ley 27.575: Telemedicina

Formato del informe:
Título: Informe de Cumplimiento Sanitario – [Nombre de la Clínica]
Resumen ejecutivo: 1 párrafo breve.
Nivel general de cumplimiento: X%
Brechas críticas (máximo 5): con nombre de norma y riesgo (Alta/Media/Baja)
Recomendaciones: Acciones específicas con plantillas descargables
Nota final: “Este informe fue generado por TS Bio Consulting AI. No sustituye asesoría legal.”

No uses viñetas en el resumen. Usa párrafos completos.
"""

    try:
        # 4. Llamar a Ollama (IA local)
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        if not response.ok: raise HTTPException(status_code=500, detail="Error al comunicarse con Ollama")

        data = response.json()
        report_text = data["response"]

        # 5. Guardar el informe en la auditoría
        audit.report = report_text
        db.commit()

        return {"report": report_text}

    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=500, detail="No se pudo conectar con Ollama. Asegúrate de que esté corriendo.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar el informe: {str(e)}")

@router.post("/search")
def semantic_search(query_data: SearchQuery):
    try:
        results = kb.search(query_data.query, k=2)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en búsqueda: {str(e)}")