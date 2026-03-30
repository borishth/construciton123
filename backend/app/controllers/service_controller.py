from typing import List
from ..services.service_request_service import service_request_service
from ..models.service_request import ServiceRequest

class ServiceController:
    @staticmethod
    def get_all_requests() -> List[ServiceRequest]:
        return service_request_service.get_all_requests()

    @staticmethod
    def create_request(request: ServiceRequest) -> ServiceRequest:
        return service_request_service.create_request(request)

    @staticmethod
    def update_status(request_id: str) -> ServiceRequest:
        return service_request_service.update_status(request_id)

service_controller = ServiceController()
