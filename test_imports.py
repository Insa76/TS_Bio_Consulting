# test_imports.py
from sentence_transformers import SentenceTransformer

print("✅ Torch:", __import__('torch').__version__)
print("✅ Sentence Transformers:", __import__('sentence_transformers').__version__)
print("✅ Hugging Face Hub:", __import__('huggingface_hub').__version__)

model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ Modelo cargado correctamente")