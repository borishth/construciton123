from fastapi import APIRouter, HTTPException
from app.db import get_connection
from app.schemas.inspection import InspectionCreate

router = APIRouter()

def _get_table_columns(cur, table: str):
    cur.execute("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = %s
    """, (table,))
    return [row[0] for row in cur.fetchall()]

@router.post("/", response_model=dict)
def create_inspection(payload: InspectionCreate):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cols = _get_table_columns(cur, "inspections")
        insert_cols = ["template_id", "project_name"]
        insert_vals = [payload.template_id, payload.project_name]
        
        # Spec: assigned_to, due_date
        if "assigned_to" in cols and payload.assigned_to:
            insert_cols.append("assigned_to")
            insert_vals.append(payload.assigned_to)
        elif "inspector_name" in cols and payload.assigned_to:
            insert_cols.append("inspector_name")
            insert_vals.append(payload.assigned_to)

        if "due_date" in cols and payload.due_date:
            insert_cols.append("due_date")
            insert_vals.append(payload.due_date)
            
        if "status" in cols:
            insert_cols.append("status")
            insert_vals.append("pending")

        col_str = ", ".join(insert_cols)
        placeholder_str = ", ".join(["%s"] * len(insert_vals))
        
        cur.execute(f"INSERT INTO inspections ({col_str}) VALUES ({placeholder_str}) RETURNING id", insert_vals)
        new_id = cur.fetchone()[0]
        conn.commit()
        return {"success": True, "inspection_id": new_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.get("/{inspection_id}/items", response_model=dict)
def get_inspection_items(inspection_id: int):
    """Load all items for the template linked to this inspection."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        # 1. Get template_id from inspections
        cur.execute("SELECT template_id FROM inspections WHERE id = %s", (inspection_id,))
        insp = cur.fetchone()
        if not insp:
            raise HTTPException(status_code=404, detail="Inspection not found")
        template_id = insp[0]
        
        # 2. Get questions from checklist_items
        cols = _get_table_columns(cur, "checklist_items")
        text_col = next((c for c in ["question_text", "text"] if c in cols), "id")
        
        cur.execute(f"SELECT id, {text_col} FROM checklist_items WHERE template_id = %s", (template_id,))
        rows = cur.fetchall()
        data = [{"id": r[0], "question_text": r[1]} for r in rows]
        
        return {"success": True, "data": data}
    except HTTPException:
         raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()