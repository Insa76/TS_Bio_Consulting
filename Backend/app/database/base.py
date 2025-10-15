# app/database/base.py
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# ✅ Importa todos los modelos aquí para que se registren en Base.metadata
from app.models.user import User
from app.models.audit import Audit
from app.models.report import Report
from app.models.task import Task
from app.models.team import Team
from app.models.contact_message import ContactMessage