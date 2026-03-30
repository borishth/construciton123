from typing import List, Dict
from ..models.inspection import Inspection, ChecklistItem, InspectionSummary, ChecklistResponse
from ..models.service_request import ServiceRequest

# In-memory mock database
class MockDB:
    def __init__(self):
        self.inspections: List[Inspection] = [
            Inspection(
                id='#QC-8821', 
                projectName='Mega Mall Residency',
                siteName='Site B: North Wing Slab', 
                structureType='Commercial',
                checklistType='Structural Inspection',
                inspectorName='John Doe',
                date='23 Mar 2026', 
                status='PASS',
                summary=InspectionSummary(totalItems=5, passedCount=5, failedCount=0, naCount=0)
            ),
            Inspection(
                id='#QC-8819', 
                projectName='T3 International Airport',
                siteName='Main Terminal: HVAC Ducting', 
                structureType='Industrial',
                checklistType='MEP Systems',
                inspectorName='Sarah Chen',
                date='22 Mar 2026', 
                status='FAIL',
                summary=InspectionSummary(totalItems=5, passedCount=3, failedCount=2, naCount=0)
            ),
        ]
        
        self.reports: List[Inspection] = self.inspections

        self.service_requests: List[ServiceRequest] = [
            ServiceRequest(id='SR-001', issue='Crack in North Wing Slab', assignee='Rajan Kumar', priority='High', repairDate='25 Mar 2026', status='In Progress'),
            ServiceRequest(id='SR-002', issue='HVAC Duct misalignment', assignee='Suresh Menon', priority='Medium', repairDate='28 Mar 2026', status='Pending'),
        ]

        self.checklist_items: List[ChecklistItem] = [
            ChecklistItem(id='1', label='Structural Beam Alignment', icon='layers'),
            ChecklistItem(id='2', label='Concrete Reinforcement Check', icon='security'),
            ChecklistItem(id='3', label='Welding Quality: Section B', icon='straighten'),
            ChecklistItem(id='4', label='Column Plumb Alignment', icon='inventory'),
            ChecklistItem(id='5', label='Joist and Decking Secure', icon='electrical-services'),
            ChecklistItem(id='6', label='Site Safety & Cleanup', icon='cleaning-services'),
        ]

        self.inspection_types = [
            'Structural Inspection', 'Safety Compliance', 'Material Quality',
            'HVAC Systems', 'Electrical Systems', 'Plumbing & Drainage',
        ]
        
        self.defect_types = [
            'Rust / Corrosion', 'Misalignment', 'Incomplete Welding', 
            'Cracking', 'Surface Damage', 'Improper Sealing', 'Others'
        ]

db = MockDB()
