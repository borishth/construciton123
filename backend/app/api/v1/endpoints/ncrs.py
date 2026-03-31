from fastapi import APIRouter
from typing import List
from app.controllers.ncr_controller import ncr_controller
from app.schemas.ncr import NCR, NCRCreate

router = APIRouter()


@router.get("/", response_model=List[NCR])
def get_ncrs():
    """Get all NCRs."""
    return ncr_controller.get_all_ncrs()


@router.get("/inspection/{inspection_id}", response_model=List[NCR])
def get_ncrs_by_inspection(inspection_id: str):
    """Get NCRs for a specific inspection."""
    return ncr_controller.get_ncrs_by_inspection(inspection_id)


@router.post("/")
def create_ncr(ncr: NCRCreate):
    """Create a new NCR."""
    return ncr_controller.create_ncr(ncr)


@router.put("/{ncr_id}/status")
def update_ncr_status(ncr_id: str, status: str):
    """Update NCR status."""
    return ncr_controller.update_ncr_status(ncr_id, status)
