# app/routers/audits.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.audit import AuditCreate, AuditResponse
from app.crud.audit import create_audit, get_audits_by_user, get_audit_by_id
from app.auth import get_current_user
from app.models.user import User

router = APIRouter(tags=["audits"])

# Crear una nueva auditoría
@router.post("/", response_model=AuditResponse)
def create_audit_endpoint(
    audit_data: AuditCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_audit(db=db, audit=audit_data, user_id=current_user.id)

# Obtener todas las auditorías del usuario actual
@router.get("/", response_model=List[AuditResponse])
def read_audits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    audits = get_audits_by_user(db, user_id=current_user.id)
    return audits

# Obtener una auditoría específica por ID
@router.get("/{audit_id}", response_model=AuditResponse)
def read_audit(
    audit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    audit = get_audit_by_id(db, audit_id=audit_id, user_id=current_user.id)
    if not audit:
        raise HTTPException(status_code=404, detail="Auditoría no encontrada")
    return audit