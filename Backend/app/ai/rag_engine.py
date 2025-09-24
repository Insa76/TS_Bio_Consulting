import os
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings

EMBEDDINGS_PATH = "../../ai-knowledge-base/embeddings/faiss_index"

def get_relevant_law(query: str, k: int = 3) -> list[str]:
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    vectorstore = FAISS.load_local(
        EMBEDDINGS_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )
    docs = vectorstore.similarity_search(query, k=k)
    return [doc.page_content for doc in docs]