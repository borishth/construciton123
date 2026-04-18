from pydantic import BaseModel, Field
from typing import Optional, List

class InspectionAnswerCreate(BaseModel):
    inspection_id: int
    checklist_item_id: int
    answer: str = Field(..., description="yes, no, or na")

class AnswerBulkCreate(BaseModel):
    answers: List[InspectionAnswerCreate]

class InspectionAnswerResponse(BaseModel):
    id: int
    inspection_id: int
    checklist_item_id: int
    answer: str

    class Config:
        orm_mode = True
