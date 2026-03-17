from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.application.use_cases.get_dashboard_summary import GetDashboardSummaryUseCase
from app.core.auth.security import get_current_user
from app.core.database import get_db
from app.infrastructure.models.user_model import UserModel
from app.infrastructure.repositories.sqlalchemy_consumption_repository import SQLAlchemyConsumptionRepository
from app.presentation.schemas.dashboard import DashboardSummaryResponse

router = APIRouter()


@router.get("/dashboard/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user),
) -> DashboardSummaryResponse:
    repo = SQLAlchemyConsumptionRepository(db)
    use_case = GetDashboardSummaryUseCase(repo)
    summary = use_case.execute()
    return DashboardSummaryResponse(**summary)
