from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.application.use_cases.get_platform_insights import GetPlatformInsightsUseCase
from app.core.auth.security import get_current_user
from app.core.database import get_db
from app.infrastructure.models.user_model import UserModel
from app.infrastructure.repositories.sqlalchemy_consumption_repository import SQLAlchemyConsumptionRepository
from app.presentation.schemas.insights import InsightsResponse

router = APIRouter()


@router.get("/dashboard/insights", response_model=InsightsResponse)
def get_platform_insights(
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user),
) -> InsightsResponse:
    repo = SQLAlchemyConsumptionRepository(db)
    use_case = GetPlatformInsightsUseCase(repo)
    insights = use_case.execute()
    return InsightsResponse(**insights)
