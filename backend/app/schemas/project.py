from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    client: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    model_config = ConfigDict(from_attributes=True)
