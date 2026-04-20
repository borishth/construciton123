from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class DailyReportBase(BaseModel):
    project_id: Optional[str] = None
    project_name: str
    date: str
    work_done: str
    progress_notes: Optional[str] = None
    general_notes: Optional[str] = None
    inspection_refs: List[str] = []  # list of inspection IDs
    ncr_refs: List[str] = []  # list of NCR IDs

class DailyReportCreate(DailyReportBase):
    pass

class DailyReport(DailyReportBase):
    id: str

    model_config = ConfigDict(from_attributes=True)
