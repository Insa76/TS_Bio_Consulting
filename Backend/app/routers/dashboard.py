# app/routers/dashboard.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.audit import Audit
from app.models.task import Task
from app.auth import get_current_user
from app.models.user import User

router = APIRouter(tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Nivel de cumplimiento promedio
    audits = db.query(Audit).filter(Audit.user_id == current_user.id).all()
    avg_compliance = sum(a.score for a in audits) / len(audits) if len(audits) > 0 else 0

    # Total de auditorías
    total_audits = len(audits)

    # Tareas pendientes y completadas
    tasks = db.query(Task).filter(Task.responsible == current_user.name).all()
    pending_tasks = len([t for t in tasks if t.status == "Pendiente"])
    completed_tasks = len([t for t in tasks if t.status == "Completada"])

    # Alertas críticas (tareas vencidas)
    from datetime import datetime
    critical_alerts = len([
        t for t in tasks 
        if t.status == "Pendiente" and t.deadline < datetime.utcnow()
    ])

    # Últimas 5 auditorías (para el gráfico)
    recent_audits = db.query(Audit).filter(Audit.user_id == current_user.id).order_by(Audit.created_at.desc()).limit(5).all()

    # Últimos 5 informes (para la lista)
    recent_reports = db.query(Audit).filter(Audit.user_id == current_user.id).order_by(Audit.created_at.desc()).limit(5).all()

    return {
        "avgCompliance": round(avg_compliance),
        "totalAudits": total_audits,
        "pendingTasks": pending_tasks,
        "completedTasks": completed_tasks,
        "criticalAlerts": critical_alerts,
        "recentAudits": [
            {
                "id": r.id,
                "date": r.created_at.isoformat(),
                "score": r.score
            }
            for r in recent_audits
        ],
        "recentReports": [
            {
                "id": r.id,
                "created_at": r.created_at.isoformat(),
                "score": r.score
            }
            for r in recent_reports
        ]
    }