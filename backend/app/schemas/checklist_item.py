from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class ChecklistItemCreate(BaseModel):
    template_id: str = Field(..., description="FK to templates.id")
    question_text: str = Field(..., description="Question displayed in checklist")
    order_index: Optional[int] = Field(None, description="Optional ordering index")
    answer_type: Optional[str] = Field('yes_no_na', description="Answer type, default yes_no_na")

class ChecklistItemOut(BaseModel):
    id: str
    template_id: str
    question_text: str
    order_index: Optional[int] = None
    answer_type: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ChecklistItemBulkCreate(BaseModel):
    items: List[ChecklistItemCreate]
