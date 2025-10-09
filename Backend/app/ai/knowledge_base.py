# app/ai/knowledge_base.py
import os
import pdfplumber
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Ruta base del proyecto
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KNOWLEDGE_BASE_PATH = os.path.join(BASE_DIR, "ai-knowledge-base")

class KnowledgeBase:
    def __init__(self):
        self.index = None
        self.chunks = []
        self.load()

    def load(self):
        try:
            embeddings = OllamaEmbeddings(model="nomic-embed-text")
            index_path = os.path.join(KNOWLEDGE_BASE_PATH, "embeddings", "faiss_index")
            self.index = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
            print("✅ Base de conocimiento cargada correctamente")
        except Exception as e:
            print(f"❌ Error al cargar base de conocimiento: {str(e)}")
            self.index = None

    def search(self, query: str, k: int = 3) -> list:
        if not self.index:
            return ["❌ Base de conocimiento no cargada"]
        try:
            docs = self.index.similarity_search(query, k=k)
            return [doc.page_content for doc in docs]
        except Exception as e:
            return [f"❌ Error en búsqueda: {str(e)}"]

# Instancia global
kb = KnowledgeBase()