from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class TemplateCreate(BaseModel):
    work_type: str = Field(..., description="e.g. Concrete")
    checklist_title: str = Field(..., description="e.g. Column Inspection")

class TemplateResponse(BaseModel):
    id: int
    work_type: Optional[str] = None
    checklist_title: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
