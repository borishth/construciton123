from pydantic import BaseModel
from typing import Optional, List


class InspectionV2Create(BaseModel):
    template_id: int
    project_name: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = "PENDING"


class InspectionV2Out(BaseModel):
    id: int
    template_id: int
    project_name: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[str] = None


class AnswerCreate(BaseModel):
    checklist_item_id: int
    answer: str          # 'Yes', 'No', 'N/A'
    remark: Optional[str] = None


class AnswersBulkCreate(BaseModel):
    answers: List[AnswerCreate]


class AnswerOut(BaseModel):
    id: int
    inspection_id: int
    checklist_item_id: int
    answer: str
    remark: Optional[str] = None
