from pydantic import BaseModel, Field
from typing import Optional, List

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    client: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    class Config:
        from_attributes = True
