from pydantic import BaseModel
from typing import Optional

class ServiceRequestBase(BaseModel):
    issue: str
    assignee: str
    priority: str
    repairDate: str
    status: str

class ServiceRequestCreate(ServiceRequestBase):
    pass

class ServiceRequest(ServiceRequestBase):
    id: str

    class Config:
        from_attributes = True
