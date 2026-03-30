from typing import List
from .mock_db import db
from ..models.inspection import Inspection, ChecklistItem

class InspectionService:
    @staticmethod
    def get_all_inspections() -> List[Inspection]:
        return db.inspections

    @staticmethod
    def get_reports() -> List[Inspection]:
        return db.reports

    @staticmethod
    def get_checklist_items() -> List[ChecklistItem]:
        return db.checklist_items

    @staticmethod
    def get_inspection_types() -> List[str]:
        return db.inspection_types

    @staticmethod
    def create_inspection(inspection: Inspection) -> Inspection:
        db.inspections.insert(0, inspection)
        db.reports.insert(0, inspection)
        return inspection

inspection_service = InspectionService()
