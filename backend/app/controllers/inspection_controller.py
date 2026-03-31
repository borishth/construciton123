from typing import List
from app.services.supabase_service import supabase_client
from app.schemas.inspection import Inspection, InspectionCreate, ChecklistItem


class InspectionController:
    @staticmethod
    def get_all_inspections() -> List[Inspection]:
        """
        Fetch all inspections from Supabase.
        """
        response = supabase_client.table("inspections").select("*").execute()

        inspections = []
        for item in response.data:
            inspections.append(
                Inspection(
                    id=str(item.get("id", "")),
                    projectName=item.get("project_name", ""),
                    siteName=item.get("site_name", ""),
                    structureType=item.get("structure_type", ""),
                    checklistType=item.get("checklist_type", ""),
                    date=item.get("inspection_date", ""),
                    inspectorName=item.get("inspector_name", ""),
                    status=item.get("status", "PENDING"),
                    responses=[],
                    summary={
                        "totalItems": 0,
                        "passedCount": 0,
                        "failedCount": 0,
                        "naCount": 0,
                    },
                )
            )

        return inspections

    @staticmethod
    def create_inspection(inspection: InspectionCreate) -> Inspection:
        """
        Create a new inspection in Supabase.
        """
        data = {
            "project_name": inspection.projectName,
            "site_name": inspection.siteName,
            "structure_type": inspection.structureType,
            "checklist_type": inspection.checklistType,
            "inspection_date": inspection.date,
            "inspector_name": inspection.inspectorName,
            "status": inspection.status,
        }

        response = supabase_client.table("inspections").insert(data).execute()

        if response.data:
            item = response.data[0]
            return Inspection(
                id=str(item.get("id", "")),
                projectName=item.get("project_name", ""),
                siteName=item.get("site_name", ""),
                structureType=item.get("structure_type", ""),
                checklistType=item.get("checklist_type", ""),
                date=item.get("inspection_date", ""),
                inspectorName=item.get("inspector_name", ""),
                status=item.get("status", "PENDING"),
                responses=[],
                summary={
                    "totalItems": 0,
                    "passedCount": 0,
                    "failedCount": 0,
                    "naCount": 0,
                },
            )

        raise Exception("Failed to create inspection")

    @staticmethod
    def get_checklist_items() -> List[ChecklistItem]:
        """
        Return standard checklist items.
        (Can be moved to DB later)
        """
        return [
            ChecklistItem(id="1", label="Foundation check", icon="building"),
            ChecklistItem(id="2", label="Wall alignment", icon="ruler"),
            ChecklistItem(id="3", label="Roof integrity", icon="home"),
            ChecklistItem(id="4", label="Plumbing leakage test", icon="water-drop"),
            ChecklistItem(id="5", label="Electrical safety check", icon="bolt"),
            ChecklistItem(id="6", label="Site clearance & safety", icon="cleaning-services"),
        ]


inspection_controller = InspectionController()
