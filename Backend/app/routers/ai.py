# Backend/app/routers/ai.py
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict
from app.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/ai", tags=["IA"])

@router.post("/chat")
def chat(question: Dict[str, str], current_user: User = Depends(get_current_user)):
    """
    Simulación de chat con IA (sin Ollama)
    """
    q = question.get("question", "").strip()
    if not q:
        raise HTTPException(status_code=400, detail="Pregunta vacía")
    
    # Respuesta simulada
    simulated_answer = (
        "⚠️ **IA local desactivada en esta versión de prueba.**\n\n"
        "En la versión completa instalada en su clínica, este asistente responde con base en:\n"
        "- Ley 26.529 de Derechos del Paciente\n"
        "- Normas de la ANMAT\n"
        "- Códigos de Ética Médica\n"
        "- Jurisprudencia argentina reciente\n\n"
        "Ejemplo de respuesta real: _'El consentimiento informado debe ser claro, escrito y firmado por el paciente o su representante legal, según el Art. 6 de la Ley 26.529.'_"
    )
    return {"answer": simulated_answer}

@router.get("/report/{audit_id}")
def generate_report(audit_id: int, current_user: User = Depends(get_current_user)):
    """
    Simulación de generación de informe (sin Ollama)
    """
    simulated_report = """
    <h2>📄 Informe de Cumplimiento Sanitario (Simulado)</h2>
    <p><strong>Nota:</strong> Este es un informe de ejemplo. En la versión con IA local, se genera un análisis detallado basado en sus respuestas y la normativa vigente.</p>
    
    <h3>🔍 Hallazgos clave</h3>
    <ul>
        <li>✅ Consentimientos informados alineados con Ley 26.529</li>
        <li>⚠️ Comité de Bioética no formalizado</li>
        <li>❌ Protocolos de emergencia desactualizados</li>
    </ul>

    <h3>📋 Recomendaciones</h3>
    <ol>
        <li>Constituir Comité de Bioética según Resolución 1480/2011</li>
        <li>Actualizar protocolos de emergencia cada 6 meses</li>
        <li>Capacitar al personal en normativa ANMAT</li>
    </ol>

    <p><em>Este informe fue generado automáticamente por TS Bio Consulting — Asesoría Médica con IA Local.</em></p>
    """
    return {"report": simulated_report}