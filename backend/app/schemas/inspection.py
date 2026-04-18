from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class InspectionCreate(BaseModel):
    template_id: int
    project_name: str
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None

class InspectionResponse(BaseModel):
    id: int
    template_id: int
    project_name: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = "pending"
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
