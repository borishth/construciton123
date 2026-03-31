from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ChecklistResponse(BaseModel):
    id: str
    label: str
    status: str # 'Yes', 'No', 'N/A'
    defectType: Optional[str] = None
    comment: Optional[str] = None

class InspectionSummary(BaseModel):
    totalItems: int
    passedCount: int
    failedCount: int
    naCount: int

class InspectionBase(BaseModel):
    projectName: str
    siteName: str
    structureType: str
    checklistType: str
    date: str
    inspectorName: str
    status: str = "PENDING" # 'PASS', 'FAIL', 'PENDING'

class InspectionCreate(InspectionBase):
    responses: List[ChecklistResponse] = []
    summary: Optional[InspectionSummary] = None

class Inspection(InspectionBase):
    id: str
    responses: List[ChecklistResponse] = []
    summary: Optional[InspectionSummary] = None

    class Config:
        from_attributes = True

class ChecklistItem(BaseModel):
    id: str
    label: str
    icon: str
