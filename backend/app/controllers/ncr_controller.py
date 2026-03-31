from typing import List
from app.services.supabase_service import supabase_client
from app.schemas.ncr import NCR, NCRCreate


class NCRController:
    @staticmethod
    def get_all_ncrs() -> List[NCR]:
        response = supabase_client.table("ncrs").select("*").execute()
        ncrs = []
        for item in response.data:
            ncrs.append(
                NCR(
                    id=str(item.get("id", "")),
                    inspection_id=item.get("inspection_id"),
                    checklist_item_id=item.get("checklist_item_id"),
                    description=item.get("description", ""),
                    severity=item.get("severity", "Medium"),
                    assigned_to=item.get("assigned_to", ""),
                    due_date=item.get("due_date", ""),
                    status=item.get("status", "Open"),
                    photos=item.get("photos", []),
                )
            )
        return ncrs

    @staticmethod
    def get_ncrs_by_inspection(inspection_id: str) -> List[NCR]:
        response = (
            supabase_client.table("ncrs")
            .select("*")
            .eq("inspection_id", inspection_id)
            .execute()
        )
        ncrs = []
        for item in response.data:
            ncrs.append(
                NCR(
                    id=str(item.get("id", "")),
                    inspection_id=item.get("inspection_id"),
                    checklist_item_id=item.get("checklist_item_id"),
                    description=item.get("description", ""),
                    severity=item.get("severity", "Medium"),
                    assigned_to=item.get("assigned_to", ""),
                    due_date=item.get("due_date", ""),
                    status=item.get("status", "Open"),
                    photos=item.get("photos", []),
                )
            )
        return ncrs

    @staticmethod
    def create_ncr(ncr: NCRCreate) -> dict:
        data = {
            "inspection_id": ncr.inspection_id,
            "checklist_item_id": ncr.checklist_item_id,
            "description": ncr.description,
            "severity": ncr.severity,
            "assigned_to": ncr.assigned_to,
            "due_date": ncr.due_date,
            "status": ncr.status,
        }
        response = supabase_client.table("ncrs").insert(data).execute()
        return response.data[0] if response.data else {}

    @staticmethod
    def update_ncr_status(ncr_id: str, status: str) -> dict:
        response = (
            supabase_client.table("ncrs")
            .update({"status": status})
            .eq("id", ncr_id)
            .execute()
        )
        return response.data[0] if response.data else {}


ncr_controller = NCRController()
