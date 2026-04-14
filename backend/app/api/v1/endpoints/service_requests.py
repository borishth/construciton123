from fastapi import APIRouter, HTTPException
from typing import List
# from app.controllers.service_controller import service_controller # Assuming this exists or will be refactored
# from app.schemas.service_request import ServiceRequest

router = APIRouter()

# For now, let's just make it a placeholder if we haven't refactored the controller yet
# But the user asked for absolute imports

@router.get("/")
def get_service_requests():
    return [
        {
            "id": "SR-101",
            "title": "Fix pipeline issue",
            "status": "Pending"
        },
        {
            "id": "SR-102",
            "title": "Inspect wall cracks",
            "status": "Completed"
        }
    ]
