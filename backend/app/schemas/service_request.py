from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
