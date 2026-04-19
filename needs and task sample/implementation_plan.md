# Implementation Plan - Inspection Answering Flow

The goal is to implement a flow where users can view a list of created inspections (projects), select one, and then fill out its checklist (Yes/No/N/A).

## Proposed Changes

### [Backend]
No changes requested, but I will ensure the frontend uses the existing endpoints correctly.

### [Frontend - Services]

#### [MODIFY] [inspection.service.ts](file:///home/jimmy/Desktop/Boris/DigiQC/construciton123/DigiQC-cli/src/services/inspection.service.ts)
- Add `getAllInspections()` to fetch the list of inspections from the backend.
- (Optional) Update `saveAnswer` to use a more robust endpoint if needed, or ensure the current one handles the user's needs.

### [Frontend - Screens]

#### [MODIFY] [InspectionsScreen.tsx](file:///home/jimmy/Desktop/Boris/DigiQC/construciton123/DigiQC-cli/src/screens/InspectionsScreen.tsx)
- Wrap inspection cards in `TouchableOpacity`.
- Implement navigation to `ChecklistExecution`, passing the `inspection_id` and other relevant metadata (Project Name, Date, etc.).

#### [MODIFY] [InspectionsTabScreen.tsx](file:///home/jimmy/Desktop/Boris/DigiQC/construciton123/DigiQC-cli/src/screens/main/InspectionsTabScreen.tsx)
- Update the "Checklist" quick action button to navigate to `Inspections` (the listing screen) instead of `Checklists` (the template assignment screen). This aligns with the user's requested flow of "View Projects -> Select -> Answer".

#### [MODIFY] [ChecklistScreen.tsx](file:///home/jimmy/Desktop/Boris/DigiQC/construciton123/DigiQC-cli/src/screens/ChecklistScreen.tsx)
- Ensure the screen correctly initializes with the passed `inspection_id`.
- Verify the "Finish Inspection" logic correctly navigates to the summary.

## Verification Plan

### Manual Verification
1.  **Open App**: Navigate to the "Inspections" tab.
2.  **Click "Checklist"**: Should now open the list of all inspections.
3.  **Select an Inspection**: Click on a specific inspection card.
4.  **Answer Checklist**: Mark items as Yes/No/N/A.
5.  **Save/Finish**: Verify answers are saved to the database and you are navigated to the summary screen.
6.  **Verify Backend**: Check database logs or use the AI Assistant to confirm the `inspection_answers` table is updated.
