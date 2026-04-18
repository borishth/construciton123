from fastapi import APIRouter
from app.api.v1.endpoints import inspections, templates, checklist_items, inspection_answers

api_router = APIRouter()

# Page 1: Templates
api_router.include_router(templates.router, prefix="/templates", tags=["templates"])

# Page 2: Checklist Items
api_router.include_router(checklist_items.router, prefix="/checklist-items", tags=["checklist_items"])

# Page 3: Inspections (Assignment)
api_router.include_router(inspections.router, prefix="/inspections", tags=["inspections"])

# Page 4: Execution (Saving Answers)
api_router.include_router(inspection_answers.router, prefix="/inspection-answers", tags=["inspection_answers"])

# Legacy / Legacy inspection_v2 can be removed or kept as local imports if needed, 
# but following the spec exactly now.