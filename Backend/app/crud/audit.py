from sqlalchemy.orm import Session
from app.models.audit import Audit
from app.schemas.audit import AuditCreate

def create_audit(db: Session, audit: AuditCreate, user_id: int):
    db_audit = Audit(**audit.dict(), user_id=user_id)
    db.add(db_audit)
    db.commit()
    db.refresh(db_audit)
    return db_audit

def get_audits_by_user(db: Session, user_id: int):
    return db.query(Audit).filter(Audit.user_id == user_id).all()

# 👇 ¡ESTA ES LA FUNCIÓN QUE FALTABA!
def get_audit_by_id(db: Session, audit_id: int, user_id: int):
    return db.query(Audit).filter(
        Audit.id == audit_id,
        Audit.user_id == user_id
    ).first()