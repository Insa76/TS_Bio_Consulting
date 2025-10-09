# app/routers/export.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import zipfile
import io
import csv
from datetime import datetime
from app.database.database import get_db
from app.models.audit import Audit
from app.models.task import Task
from app.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/export", tags=["export"])

@router.get("/data")
def export_all_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Exporta todos los datos del usuario en un archivo ZIP"""
    try:
        # 1. Obtener auditorías del usuario
        audits = db.query(Audit).filter(Audit.user_id == current_user.id).all()
        
        # 2. Obtener tareas asignadas
        tasks = db.query(Task).filter(Task.responsible == current_user.name).all()
        
        # 3. Crear buffer para el ZIP
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Añadir auditorías como CSV
            if audits:
                audit_csv = io.StringIO()
                writer = csv.writer(audit_csv)
                writer.writerow(['ID', 'Fecha', 'Puntaje', 'Respuestas'])
                for audit in audits:
                    writer.writerow([
                        audit.id,
                        audit.created_at.isoformat(),
                        audit.score,
                        str(audit.answers)
                    ])
                zip_file.writestr('auditorias.csv', audit_csv.getvalue())
            
            # Añadir tareas como CSV
            if tasks:
                task_csv = io.StringIO()
                writer = csv.writer(task_csv)
                writer.writerow(['ID', 'Acción', 'Responsable', 'Fecha límite', 'Estado'])
                for task in tasks:
                    writer.writerow([
                        task.id,
                        task.action,
                        task.responsible,
                        task.deadline.isoformat(),
                        task.status
                    ])
                zip_file.writestr('tareas.csv', task_csv.getvalue())
            
            # Añadir estadísticas como TXT
            stats_txt = f"""
Estadísticas de Cumplimiento - TS Bio Consulting
==============================================

Usuario: {current_user.name}
Email: {current_user.email}
Organización: {current_user.organization}
Rol: {current_user.role}

Total de auditorías: {len(audits)}
Puntaje promedio: {round(sum(a.score for a in audits) / len(audits)) if audits else 0}%

Tareas pendientes: {len([t for t in tasks if t.status == 'Pendiente'])}
Tareas completadas: {len([t for t in tasks if t.status == 'Completada'])}

Generado el: {datetime.utcnow().isoformat()}
"""
            zip_file.writestr('estadisticas.txt', stats_txt)
        
        # Devolver el ZIP
        zip_buffer.seek(0)
        return Response(
            content=zip_buffer.getvalue(),
            headers={
                "Content-Disposition": f"attachment; filename=tsbio-export-{datetime.utcnow().strftime('%Y%m%d')}.zip",
                "Content-Type": "application/zip"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al exportar datos: {str(e)}")