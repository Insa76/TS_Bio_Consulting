# Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Copiar requirements.txt y .env
COPY requirements.txt .
COPY .env .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# ✅ Copiar la base de conocimiento legal (¡CLAVE!)
COPY ai-knowledge-base /ai-knowledge-base  

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 8000

# Comando por defecto
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]