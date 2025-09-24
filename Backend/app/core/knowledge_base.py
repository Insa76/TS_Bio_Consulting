# app/core/knowledge_base.py
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
import pickle
from typing import List

# Modelo para generar embeddings (liviano y rápido)
MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'
EMBEDDING_DIM = 384  # Dimensiones del modelo
INDEX_FILE = "faiss_index.bin"
DATA_FILE = "knowledge_data.pkl"

# Cargar modelo
model = SentenceTransformer(MODEL_NAME)

class KnowledgeBase:
    def __init__(self):
        self.index = faiss.IndexFlatL2(EMBEDDING_DIM)  # Índice simple
        self.chunks = []  # Textos originales
        self.load()

    def add_texts(self, texts: List[str]):
        """Agrega nuevos textos al índice"""
        embeddings = model.encode(texts)
        if len(embeddings) > 0:
            self.index.add(np.array(embeddings).astype('float32'))
            self.chunks.extend(texts)
        self.save()

    def search(self, query: str, k: int = 3) -> List[str]:
        """Busca los k fragmentos más similares"""
        query_embedding = model.encode([query])
        distances, indices = self.index.search(np.array(query_embedding).astype('float32'), k)
        return [self.chunks[i] for i in indices[0] if i < len(self.chunks)]

    def save(self):
        """Guarda el índice y los datos"""
        faiss.write_index(self.index, INDEX_FILE)
        with open(DATA_FILE, "wb") as f:
            pickle.dump(self.chunks, f)

    def load(self):
        """Carga el índice si existe"""
        if os.path.exists(INDEX_FILE) and os.path.exists(DATA_FILE):
            self.index = faiss.read_index(INDEX_FILE)
            with open(DATA_FILE, "rb") as f:
                self.chunks = pickle.load(f)

# Instancia global
kb = KnowledgeBase()