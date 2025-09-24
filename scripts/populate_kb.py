# scripts/populate_kb.py

import sys
import os

# Añade la raíz del proyecto al path de Python
# Añade la carpeta Backend al PYTHONPATH
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'Backend'))

# Ahora sí puedes importar desde app
from app.core.knowledge_base import kb

# Datos de ejemplo (puedes cargarlos desde archivos después)
normativas = [
    "Ley 26.529 - Artículo 5: Todo paciente tiene derecho a recibir información completa sobre su salud.",
    "Ley 25.916 - Gestión de residuos peligrosos en instituciones sanitarias.",
    "ANMAT - Requisitos para estudios clínicos y comités de ética."
]

# Agrega los textos al índice FAISS
kb.add_texts(normativas)

print("✅ Base de conocimiento cargada con", len(kb.chunks), "fragmentos.")
print("📁 Índice guardado en 'faiss_index.bin'")
print("📄 Metadatos guardados en 'knowledge_data.pkl'")