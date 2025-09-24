from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate

def get_user_by_firebase_uid(db: Session, firebase_uid: str):
    return db.query(User).filter(User.firebase_uid == firebase_uid).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        name=user.name,
        email=user.email,
        role=user.role,
        organization=user.organization,
        firebase_uid=user.firebase_uid
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: dict):
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    for key, value in user_update.items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user