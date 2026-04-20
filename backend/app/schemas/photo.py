from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
