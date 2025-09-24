# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database.database import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token, decode_access_token, create_reset_token, verify_reset_token
from app.auth import oauth2_scheme
from fastapi import Form, BackgroundTasks

router = APIRouter(tags=["auth"])

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="No autorizado")
    return payload

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email, "user_id": user.id, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

@router.post("/forgot-password")
def forgot_password(
    email: str = Form(...),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # No revelamos si el email existe por seguridad
        return {"message": "Si tu email está registrado, recibirás un enlace de recuperación."}

    token = create_reset_token(user.email)
    reset_link = f"http://localhost:5173/reset-password?token={token}"

    # Simulamos envío de email (luego puedes integrar SMTP o SendGrid)
    def send_recovery_email():
        print(f"[EMAIL SIMULADO] Hola {user.name},\n\nHaz clic en este enlace para restablecer tu contraseña:\n{reset_link}\n\nEl enlace expira en 15 minutos.")

    background_tasks.add_task(send_recovery_email)
    return {"message": "Si tu email está registrado, recibirás un enlace de recuperación."}


@router.post("/reset-password")
def reset_password(
    token: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db)
):
    email = verify_reset_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    from app.core.security import get_password_hash
    user.hashed_password = get_password_hash(new_password)
    db.commit()

    return {"message": "Contraseña actualizada con éxito."}