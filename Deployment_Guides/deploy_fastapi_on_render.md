# Cómo desplegar FastAPI en Render

1. Sube tu proyecto a GitHub.
2. Ve a https://render.com
3. Haz clic en “New Web Service”
4. Conecta tu repositorio
5. En “Build Command”: `pip install -r requirements.txt`
6. En “Start Command”: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Guarda y espera 2 minutos.
8. ¡Tu API estará en https://tuservicio.onrender.com!

✅ Prueba: https://tuservicio.onrender.com/docs → verás la documentación de Swagger.