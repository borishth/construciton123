from fastapi import APIRouter
from app.api.v1.endpoints import inspections, service_requests, ai, ncrs, daily_reports, projects, photos

api_router = APIRouter()
api_router.include_router(inspections.router, prefix="/inspections", tags=["inspections"])
api_router.include_router(service_requests.router, prefix="/service-requests", tags=["service-requests"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(ncrs.router, prefix="/ncrs", tags=["ncrs"])
api_router.include_router(daily_reports.router, prefix="/daily-reports", tags=["daily-reports"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(photos.router, prefix="/photos", tags=["photos"])
