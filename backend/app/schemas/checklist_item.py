from pydantic import BaseModel, Field
from typing import List, Optional

class ChecklistItemCreate(BaseModel):
    template_id: int = Field(..., description="FK to templates.id")
    question_text: str = Field(..., description="Question displayed in checklist")
    order_index: Optional[int] = Field(None, description="Optional ordering index")
    answer_type: Optional[str] = Field('yes_no_na', description="Answer type, default yes_no_na")

class ChecklistItemOut(BaseModel):
    id: int
    template_id: int
    question_text: str
    order_index: Optional[int] = None
    answer_type: Optional[str] = None

    class Config:
        orm_mode = True

class ChecklistItemBulkCreate(BaseModel):
    items: List[ChecklistItemCreate]
