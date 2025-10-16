# Backend/app/ai/legal_chatbot.py
import os
from pathlib import Path
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# 📌 Ruta ABSOLUTA al índice FAISS (evita errores de contexto)
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # Raíz del proyecto (Backend/)
EMBEDDINGS_PATH = BASE_DIR / "ai-knowledge-base" / "embeddings" / "faiss_index"

def load_rag_system():
    if not EMBEDDINGS_PATH.exists():
        raise FileNotFoundError(f"❌ Carpeta de embeddings no encontrada: {EMBEDDINGS_PATH}")
    
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    vectorstore = FAISS.load_local(str(EMBEDDINGS_PATH), embeddings, allow_dangerous_deserialization=True)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    
    template = """
    Eres un asistente legal especializado en normativa médica argentina.
    Responde SOLO con base en el contexto proporcionado.
    Si no sabes la respuesta, di: "No tengo información suficiente sobre eso."
    
    Contexto: {context}
    Pregunta: {question}
    Respuesta (en español argentino, clara y profesional):
    """
    prompt = ChatPromptTemplate.from_template(template)
    llm = ChatOllama(model="llama3", temperature=0.1)
    
    chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain

# ✅ Carga el chatbot SOLO si se va a usar (evita fallos al importar)
chatbot = None

def get_chatbot():
    global chatbot
    if chatbot is None:
        chatbot = load_rag_system()
    return chatbot

def ask_legal_question(question: str) -> str:
    bot = get_chatbot()
    return bot.invoke(question)