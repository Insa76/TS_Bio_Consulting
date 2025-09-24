import os
from pathlib import Path
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# --- CONFIGURACIÓN ABSOLUTA CORREGIDA ---
# El directorio actual es donde se ejecutó `uvicorn` (backend/)
# Queremos subir UN nivel hasta la raíz del proyecto
BASE_DIR = Path(os.getcwd()).parent
EMBEDDINGS_PATH = BASE_DIR / "ai-knowledge-base" / "embeddings" / "faiss_index"

print(f"🔍 Directorio de trabajo actual: {os.getcwd()}")
print(f"📁 Ruta base del proyecto: {BASE_DIR}")
print(f"📁 Buscando embeddings en: {EMBEDDINGS_PATH}")

def load_rag_system():
    if not EMBEDDINGS_PATH.exists():
        raise FileNotFoundError(f"❌ La carpeta de embeddings no existe: {EMBEDDINGS_PATH}")

    if not (EMBEDDINGS_PATH / "index.faiss").exists():
        raise FileNotFoundError(f"❌ El archivo index.faiss no existe en: {EMBEDDINGS_PATH}")

    print("✅ Archivos de embeddings encontrados. Cargando...")

    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    vectorstore = FAISS.load_local(
        EMBEDDINGS_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )

    llm = ChatOllama(
        model="llama3",
        temperature=0.1,
        max_tokens=500,
    )

    prompt = ChatPromptTemplate.from_template("""
    Responde como un abogado especialista en salud en Argentina. Usa SOLO información de las normativas argentinas.
    Si no estás seguro, di: "Consulte con un jurista o profesional certificado."

    Contexto: {context}

    Pregunta: {question}

    Respuesta (en español argentino, claro y conciso):
    """)

    chain = (
        {"context": vectorstore.as_retriever(search_kwargs={"k": 3}), "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain

chatbot = load_rag_system()

def ask_legal_question(question: str) -> str:
    return chatbot.invoke(question)