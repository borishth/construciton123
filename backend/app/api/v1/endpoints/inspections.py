from fastapi import APIRouter, HTTPException
from typing import List
from app.controllers.inspection_controller import inspection_controller
from app.models.inspection import Inspection, InspectionCreate, ChecklistItem
from app.services.supabase_service import supabase_client

router = APIRouter()

@router.get("/", response_model=List[Inspection])
def get_inspections():
    """
    Get all inspections.
    """
    return inspection_controller.get_all_inspections()

@router.post("/")
def create_inspection(inspection: dict):
    data = {
        "project_name": inspection.get("projectName"),
        "site_name": inspection.get("siteName"),
        "structure_type": inspection.get("structureType"),
        "checklist_type": inspection.get("checklistType"),
        "inspection_date": inspection.get("date"),
        "inspector_name": inspection.get("inspectorName"),
        "status": inspection.get("status"),
    }

    response = supabase_client.table("inspections").insert(data).execute()
    return response

@router.get("/checklist-items", response_model=List[ChecklistItem])
def get_checklist_items():
    """
    Get available checklist items.
    """
    return inspection_controller.get_checklist_items()
