# app/routers/tasks.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskResponse
from app.auth import get_current_user
from app.models.user import User
from datetime import timedelta, datetime
from app.services.email_service import send_email


router = APIRouter(tags=["Tareas"])

@router.post("/", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar que el usuario puede crear tareas (solo admin o cliente con permiso)
    # En este caso, solo el admin puede asignar tareas
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden asignar tareas")

    new_task = Task(
        audit_id=task_data.audit_id,
        action=task_data.action,
        responsible=task_data.responsible,
        deadline=task_data.deadline,
        status="Pendiente"
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Solo mostrar tareas del usuario actual (o todas si es admin)
    if current_user.role == "admin":
        tasks = db.query(Task).all()
    else:
        # Si quieres filtrar por cliente, puedes hacerlo aquí
        tasks = db.query(Task).filter(Task.responsible == current_user.name).all()

    return tasks

@router.get("/notifications", response_model=List[TaskResponse])
def get_task_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Devuelve tareas que están por vencer o ya vencieron"""
    now = datetime.utcnow()
    soon_deadline = now + timedelta(hours=48)  # Tareas que vencen en las próximas 48 horas

    tasks = db.query(Task).filter(
        Task.responsible == current_user.name,
        Task.status == "Pendiente",
        Task.deadline <= soon_deadline
    ).all()

    return tasks

@router.post("/send-notifications")
def send_task_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Envía notificaciones por email a los responsables de tareas por vencer"""
    now = datetime.utcnow()
    soon_deadline = now + timedelta(hours=48)

    tasks = db.query(Task).filter(
        Task.status == "Pendiente",
        Task.deadline <= soon_deadline
    ).all()

    for task in tasks:
        # Enviar email al responsable
        subject = f"🔔 Alerta: Tarea por vencer - {task.action[:30]}..."
        body = f"""
        <h2>⚠️ Tarea por vencer</h2>
        <p><strong>Tarea:</strong> {task.action}</p>
        <p><strong>Responsable:</strong> {task.responsible}</p>
        <p><strong>Vence:</strong> {task.deadline.strftime('%d/%m/%Y %H:%M')}</p>
        <p><strong>Indicador de éxito:</strong> {task.success_indicator}</p>
        <p><a href="http://localhost:5173/tasks">Ver en el panel</a></p>
        """

        send_email(task.responsible_email or task.responsible, subject, body)

    return {"message": f"✅ Se enviaron {len(tasks)} notificaciones por email"}