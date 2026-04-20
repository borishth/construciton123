from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class TemplateCreate(BaseModel):
    work_type: str = Field(..., description="e.g. Concrete")
    checklist_title: str = Field(..., description="e.g. Column Inspection")

class TemplateResponse(BaseModel):
    id: str
    work_type: Optional[str] = None
    checklist_title: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
