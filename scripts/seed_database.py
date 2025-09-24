import os
import pdfplumber
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

# --- CONFIGURACIÓN ---
PDF_DIR = "../ai-knowledge-base"
EMBEDDINGS_PATH = "../ai-knowledge-base/embeddings/faiss_index"

# Asegúrate de que la carpeta de embeddings exista
os.makedirs(EMBEDDINGS_PATH, exist_ok=True)

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text

def create_vector_db():
    texts = []
    pdf_files = [
        "argentina_health_laws.pdf",
        "codigos_etica_medica.pdf",
        "normas_anmat.pdf"
    ]

    for filename in pdf_files:
        path = os.path.join(PDF_DIR, filename)
        if os.path.exists(path):
            print(f"📄 Procesando: {filename}")
            text = extract_text_from_pdf(path)
            texts.append(text)
        else:
            print(f"⚠️ Archivo no encontrado: {path}")

    if not texts:
        raise FileNotFoundError("No se encontraron archivos PDF en ai-knowledge-base/")

    print("✂️  Dividiendo texto en fragmentos...")
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text("\n".join(texts))
    print(f"✅ Generados {len(chunks)} fragmentos.")

    print("🧠 Generando embeddings con nomic-embed-text (local)...")
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    vectorstore = FAISS.from_texts(chunks, embeddings)

    print("💾 Guardando índice vectorial en:", EMBEDDINGS_PATH)
    vectorstore.save_local(EMBEDDINGS_PATH)
    print("🎉 ¡Base de conocimiento vectorial generada exitosamente!")

if __name__ == "__main__":
    create_vector_db()