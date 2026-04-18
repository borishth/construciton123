from pydantic import BaseModel, Field
from typing import Optional, List

class InspectionAnswerCreate(BaseModel):
    inspection_id: str
    checklist_item_id: str
    answer: str = Field(..., description="yes, no, or na")

class AnswerBulkCreate(BaseModel):
    answers: List[InspectionAnswerCreate]

class InspectionAnswerResponse(BaseModel):
    id: str
    inspection_id: str
    checklist_item_id: str
    answer: str

    class Config:
        orm_mode = True
