from fastapi import APIRouter
from app.api.v1.endpoints import inspections, service_requests, ai

api_router = APIRouter()
api_router.include_router(inspections.router, prefix="/inspections", tags=["inspections"])
api_router.include_router(service_requests.router, prefix="/service-requests", tags=["service-requests"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])