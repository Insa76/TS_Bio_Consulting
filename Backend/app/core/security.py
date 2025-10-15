# app/core/security.py
from jose import jwt
from datetime import datetime, timedelta
import os
import hashlib
import base64
from passlib.context import CryptContext

# ✅ Configura bcrypt como esquema principal
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def truncate_password(password: str) -> str:
    """Trunca la contraseña a 72 bytes para compatibilidad con bcrypt"""
    password_bytes = password.encode('utf-8')
    if len(password_bytes) <= 72:
        return password
    
    # Hashea la contraseña larga y toma los primeros 72 bytes
    hashed = hashlib.sha256(password_bytes).digest()
    truncated = hashed[:72]
    return base64.b64encode(truncated).decode('utf-8')

def get_password_hash(password: str) -> str:
    safe_password = truncate_password(password)
    return pwd_context.hash(safe_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    safe_password = truncate_password(plain_password)
    return pwd_context.verify(safe_password, hashed_password)

def create_access_token(data: dict) -> str:
    from jose import jwt
    from datetime import datetime, timedelta
    import os

    SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-jwt-key-change-this-in-production")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 días

    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    from jose import jwt
    import os

    SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-jwt-key-change-this-in-production")
    ALGORITHM = "HS256"

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError:
        return None

def create_reset_token(email: str, expires_delta: timedelta = None) -> str:
    """Crea un token de restablecimiento de contraseña"""
    from jose import jwt
    from datetime import datetime, timedelta
    import os

    SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-jwt-key-change-this-in-production")
    ALGORITHM = "HS256"

    if expires_delta is None:
        expires_delta = timedelta(hours=1)

    expire = datetime.utcnow() + expires_delta
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_reset_token(token: str) -> dict:
    """Verifica un token de restablecimiento de contraseña"""
    from jose import jwt
    import os

    SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-jwt-key-change-this-in-production")
    ALGORITHM = "HS256"

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError:
        return None