from pydantic import BaseModel
from typing import Optional

class PhotoBase(BaseModel):
    file_path: str
    related_type: str  # 'inspection', 'checklist_item', 'ncr'
    related_id: str
    caption: Optional[str] = None

class PhotoCreate(PhotoBase):
    pass

class Photo(PhotoBase):
    id: str

    class Config:
        from_attributes = True
