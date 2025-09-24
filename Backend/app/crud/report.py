from sqlalchemy.orm import Session
from app.models.report import Report
from app.schemas.report import ReportCreate
from app.models.audit import Audit

def create_report(db: Session, report_data: ReportCreate, audit_id: int):
    db_report = Report(
        audit_id=audit_id,
        content=report_data.content,
        generated_at=report_data.generated_at
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def get_report_by_audit_id(db: Session, audit_id: int):
    return db.query(Report).filter(Report.audit_id == audit_id).first()

def get_reports_by_user(db: Session, user_id: int):
    return db.query(Report).join(Report.audit).filter(Audit.user_id == user_id).all()