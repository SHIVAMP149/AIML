from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth.security import get_current_user
from app.core.database import get_db
from app.domain.entities.consumption import ConsumptionRecord
from app.infrastructure.models.user_model import UserModel
from app.infrastructure.repositories.sqlalchemy_consumption_repository import SQLAlchemyConsumptionRepository
from app.presentation.schemas.consumption import ConsumptionCreate, ConsumptionRead

router = APIRouter()


@router.get("/consumption", response_model=list[ConsumptionRead])
def list_consumption(
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user),
) -> list[ConsumptionRead]:
    repo = SQLAlchemyConsumptionRepository(db)
    rows = repo.list_records()
    return [ConsumptionRead(**row.__dict__) for row in rows]


@router.post("/consumption", response_model=ConsumptionRead)
def create_consumption(
    payload: ConsumptionCreate,
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user),
) -> ConsumptionRead:
    repo = SQLAlchemyConsumptionRepository(db)
    created = repo.create_record(ConsumptionRecord(**payload.model_dump()))
    return ConsumptionRead(**created.__dict__)
