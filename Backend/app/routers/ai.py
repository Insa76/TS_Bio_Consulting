from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict
from app.database.database import get_db
from app.crud.audit import get_audit_by_id
from app.ai.generate_report import generate_audit_report
from app.ai.legal_chatbot import ask_legal_question
from app.models.user import User
from app.auth import get_current_user
from app.ai import kb  # Importa la base de conocimiento
from pydantic import BaseModel

import requests
from app.models.audit import Audit

router = APIRouter(tags=["ai"])

class SearchQuery(BaseModel):
    query: str

@router.post("/chat")
async def chat(
    question: Dict[str, str],
    current_user: User = Depends(get_current_user)
):
    """Responde preguntas legales usando IA + base de conocimiento"""
    q = question.get("question", "")
    if not q:
        raise HTTPException(status_code=400, detail="Pregunta vacía")
    
    answer = ask_legal_question(q)
    return {"answer": answer}



@router.get("/report/{audit_id}")
def generate_ai_report(audit_id: int, db: Session = Depends(get_db)):
    audit = db.query(Audit).filter(Audit.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Auditoría no encontrada")

    # 🔍 1. Búsqueda semántica: encuentra normativas relevantes
    user_answers = " ".join(audit.answers.values())
    relevant_docs = kb.search(user_answers, k=3)  # Obtiene los 3 fragmentos más cercanos
    context = "\n\n".join(relevant_docs)

    # 🧠 2. Prompt mejorado con contexto legal
    prompt = f"""
    Eres un auditor médico experto en regulaciones sanitarias argentinas.
    Usa estrictamente la siguiente información para fundamentar tu respuesta:

    {context}

    Genera un informe ejecutivo claro, profesional y técnico basado en esta evaluación:

    Puntaje: {audit.score}/100
    Respuestas del cliente: {audit.answers}

    ### Formato del informe (en HTML):
    <h2>📋 Informe de Cumplimiento Sanitario</h2>
    <p><strong>Fecha:</strong> {audit.fecha.strftime('%d/%m/%Y')}</p>

    <h3>✅ Resumen Ejecutivo</h3>
    <p>[Diagnóstico claro del nivel de cumplimiento]</p>

    <h3>⚠️ Áreas de Mejora</h3>
    <ul>
      <li>[Problema identificado] - [Fundamento legal]</li>
    </ul>

    <h3>💡 Recomendaciones</h3>
    <p>Incluye acciones específicas, responsables y plazos.</p>

    Usa un tono formal, pero comprensible. No inventes normativas.
    """

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        response.raise_for_status()
        data = response.json()

        return {
            "report": data["response"],
            "sources": relevant_docs[:2]  # Opcional: devolver las fuentes usadas
        }

    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=500, detail="No se pudo conectar con Ollama. ¿Está corriendo?")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar el informe: {str(e)}")
    
@router.post("/search")
def semantic_search(query_data: SearchQuery):
    try:
        results = kb.search(query_data.query, k=2)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en búsqueda: {str(e)}")    