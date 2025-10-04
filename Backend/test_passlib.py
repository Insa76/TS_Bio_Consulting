# test_passlib.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

hashed = pwd_context.hash("123456")
print("Hash generado:", hashed)

verified = pwd_context.verify("123456", hashed)
print("¿Coincide?:", verified)  # Debe ser True