from fastapi import APIRouter
from typing import List
from app.controllers.daily_report_controller import daily_report_controller
from app.schemas.daily_report import DailyReport, DailyReportCreate

router = APIRouter()


@router.get("/", response_model=List[DailyReport])
def get_daily_reports():
    """Get all daily reports."""
    return daily_report_controller.get_all_reports()


@router.post("/")
def create_daily_report(report: DailyReportCreate):
    """Create a new daily report."""
    return daily_report_controller.create_report(report)
