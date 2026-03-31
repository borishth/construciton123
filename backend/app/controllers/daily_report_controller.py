from typing import List
from app.services.supabase_service import supabase_client
from app.schemas.daily_report import DailyReport, DailyReportCreate


class DailyReportController:
    @staticmethod
    def get_all_reports() -> List[DailyReport]:
        response = supabase_client.table("daily_reports").select("*").execute()
        reports = []
        for item in response.data:
            reports.append(
                DailyReport(
                    id=str(item.get("id", "")),
                    project_id=item.get("project_id"),
                    project_name=item.get("project_name", ""),
                    date=item.get("date", ""),
                    work_done=item.get("work_done", ""),
                    progress_notes=item.get("progress_notes"),
                    general_notes=item.get("general_notes"),
                    inspection_refs=item.get("inspection_refs", []),
                    ncr_refs=item.get("ncr_refs", []),
                )
            )
        return reports

    @staticmethod
    def create_report(report: DailyReportCreate) -> dict:
        data = {
            "project_id": report.project_id,
            "project_name": report.project_name,
            "date": report.date,
            "work_done": report.work_done,
            "progress_notes": report.progress_notes,
            "general_notes": report.general_notes,
            "inspection_refs": report.inspection_refs,
            "ncr_refs": report.ncr_refs,
        }
        response = supabase_client.table("daily_reports").insert(data).execute()
        return response.data[0] if response.data else {}


daily_report_controller = DailyReportController()
