from typing import List
from .mock_db import db
from ..models.service_request import ServiceRequest

class ServiceRequestService:
    @staticmethod
    def get_all_requests() -> List[ServiceRequest]:
        return db.service_requests

    @staticmethod
    def create_request(request: ServiceRequest) -> ServiceRequest:
        db.service_requests.insert(0, request)
        return request

    @staticmethod
    def update_status(request_id: str) -> ServiceRequest:
        next_status = {
            "Pending": "In Progress",
            "In Progress": "Completed",
            "Completed": "Completed"
        }
        for req in db.service_requests:
            if req.id == request_id:
                req.status = next_status.get(req.status, req.status)
                return req
        return None

service_request_service = ServiceRequestService()
