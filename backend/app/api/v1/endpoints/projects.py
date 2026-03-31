from fastapi import APIRouter
from typing import List
from app.schemas.project import Project, ProjectCreate
from app.services.supabase_service import supabase_client

router = APIRouter()

@router.get("/", response_model=List[Project])
def get_projects():
    """Get all projects."""
    response = supabase_client.table("projects").select("*").execute()
    projects = []
    for item in response.data:
        projects.append(
            Project(
                id=str(item.get("id", "")),
                name=item.get("name", ""),
                description=item.get("description", ""),
                client=item.get("client", ""),
            )
        )
    return projects

@router.post("/")
def create_project(project: ProjectCreate):
    """Create a new project."""
    data = {
        "name": project.name,
        "description": project.description,
        "client": project.client,
    }
    response = supabase_client.table("projects").insert(data).execute()
    return response.data[0] if response.data else {}
