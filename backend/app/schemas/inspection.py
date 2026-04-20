from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class InspectionCreate(BaseModel):
    template_id: str
    project_name: str
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None

class InspectionResponse(BaseModel):
    id: str
    template_id: str
    project_name: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = "PENDING"
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class AnswerCreate(BaseModel):
    checklist_item_id: str
    answer: str          # 'Yes', 'No', 'N/A'
    remark: Optional[str] = None

class AnswersBulkCreate(BaseModel):
    answers: List[AnswerCreate]
