from pydantic import BaseModel
from typing import Optional, List

class NCRBase(BaseModel):
    inspection_id: Optional[str] = None
    checklist_item_id: Optional[str] = None
    description: str
    severity: str  # 'Low', 'Medium', 'High', 'Critical'
    assigned_to: str
    due_date: str
    status: str = "Open"  # 'Open', 'In Progress', 'Closed'

class NCRCreate(NCRBase):
    pass

class NCR(NCRBase):
    id: str
    photos: List[str] = []

    class Config:
        from_attributes = True
