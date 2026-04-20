from pydantic import BaseModel, Field, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
