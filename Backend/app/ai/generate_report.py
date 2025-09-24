import os
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate

# Configuración del modelo local
llm = ChatOllama(
    model="llama3",
    temperature=0.2,
    max_tokens=1200,
    timeout=60,
)

PROMPT_TEMPLATE = """
Eres un experto en salud argentina. Basado en las siguientes respuestas de una clínica privada, genera un informe de cumplimiento en español argentino, claro y técnico.

Respuestas:
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
Nivel general de cumplimiento: X%.
Brechas críticas (máximo 5): Describe cada una con norma afectada y riesgo (Alta/Media/Baja).
Recomendaciones: Acciones específicas con plantillas descargables.
Nota final: “Este informe fue generado por TS Bio Consulting AI. No sustituye asesoría legal.”

No uses viñetas en el resumen. Usa párrafos completos.
"""

prompt = PromptTemplate.from_template(PROMPT_TEMPLATE)

def generate_audit_report(answers: dict) -> str:
    chain = prompt | llm
    response = chain.invoke({"answers": str(answers)})
    return response.content.replace("\n", "<br>")