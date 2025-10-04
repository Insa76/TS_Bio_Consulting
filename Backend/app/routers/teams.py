# app/routers/teams.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.team import Team
from app.models.user import User
from app.auth import get_current_user
from app.schemas.team import TeamCreate, TeamResponse, TeamUpdate, UserResponse
from datetime import datetime

router = APIRouter( tags=["equipos"])

# Crear equipo
@router.post("/", response_model=TeamResponse)
def create_team(
    team_data: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden crear equipos")

    # Verificar que el nombre no esté en uso
    existing_team = db.query(Team).filter(Team.name == team_data.name).first()
    if existing_team:
        raise HTTPException(status_code=400, detail="Nombre de equipo ya existe")

    new_team = Team(
        name=team_data.name,
        description=team_data.description
    )

    try:
        db.add(new_team)
        db.commit()
        db.refresh(new_team)
        return new_team
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear equipo: {str(e)}")

# Obtener todos los equipos
@router.get("/", response_model=List[TeamResponse])
def get_teams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden ver equipos")

    teams = db.query(Team).all()

    # ✅ Verifica que cada equipo tenga created_at y updated_at
    for team in teams:
        if not team.created_at:
            team.created_at = datetime.utcnow()
        if not team.updated_at:
            team.updated_at = datetime.utcnow()

    return teams

# Obtener un equipo por ID
@router.get("/{team_id}", response_model=TeamResponse)
def get_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden ver equipos")

    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return team

# Actualizar equipo
@router.put("/{team_id}", response_model=TeamResponse)
def update_team(
    team_id: int,
    team_data: TeamUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=4403, detail="Solo los administradores pueden editar equipos")

    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    team.name = team_data.name
    team.description = team_data.description

    try:
        db.commit()
        db.refresh(team)
        return team
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar equipo: {str(e)}")

# Eliminar equipo
@router.delete("/{team_id}")
def delete_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden eliminar equipos")

    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    try:
        db.delete(team)
        db.commit()
        return {"message": "Equipo eliminado con éxito"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar equipo: {str(e)}")

# Asignar miembro a equipo
@router.post("/{team_id}/members")
def assign_member_to_team(
    team_id: int,
    member_email: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden asignar miembros")

    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    user = db.query(User).filter(User.email == member_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user.team_id = team_id
    try:
        db.commit()
        return {"message": f"✅ {user.name} asignado al equipo {team.name}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al asignar miembro: {str(e)}")

# Obtener miembros de un equipo
@router.get("/{team_id}/members", response_model=List[UserResponse])
def get_team_members(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden ver miembros")

    members = db.query(User).filter(User.team_id == team_id).all()
    return members