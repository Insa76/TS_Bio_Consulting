# test_ollama.py
import requests

try:
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": "Hola, ¿funcionas?",
            "stream": False
        },
        timeout=60  # ⬅️ Cambia de 10 a 60 segundos
    )
    print("✅ Respuesta de Ollama:", response.json()["response"])
except Exception as e:
    print("❌ Error al conectar con Ollama:", e)