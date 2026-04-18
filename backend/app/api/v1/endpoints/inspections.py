from fastapi import APIRouter, HTTPException
from app.db import get_connection
from app.schemas.inspection import InspectionCreate, AnswersBulkCreate

router = APIRouter()

def _get_table_columns(cur, table: str):
    cur.execute("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = %s
    """, (table,))
    return [row[0] for row in cur.fetchall()]

@router.get("/", response_model=dict)
def list_inspections():
    """List all inspections with adaptive column mapping."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cols = _get_table_columns(cur, "inspections")
        # Find the priority / name column
        name_col = next((c for c in ["project_name", "project", "site_name"] if c in cols), "id")
        
        cur.execute(f"SELECT id, {name_col}, status, created_at FROM inspections ORDER BY created_at DESC")
        rows = cur.fetchall()
        
        data = []
        for r in rows:
            data.append({
                "id": str(r[0]),
                "project_name": r[1],
                "status": r[2],
                "created_at": str(r[3]) if r[3] else None
            })
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.post("/", response_model=dict)
def create_inspection(payload: InspectionCreate):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cols = _get_table_columns(cur, "inspections")
        insert_cols = ["template_id"]
        insert_vals = [payload.template_id]
        
        # Adaptive Project Name
        if "project_name" in cols:
            insert_cols.append("project_name")
            insert_vals.append(payload.project_name)
        elif "project" in cols:
            insert_cols.append("project")
            insert_vals.append(payload.project_name)
        elif "site_name" in cols:
            insert_cols.append("site_name")
            insert_vals.append(payload.project_name)
        
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
def get_inspection_items(inspection_id: str):
    """Load items for an inspection, JOINING with existing answers if available."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT template_id FROM inspections WHERE id = %s", (inspection_id,))
        insp = cur.fetchone()
        if not insp:
            raise HTTPException(status_code=404, detail="Inspection not found")
        template_id = insp[0]
        
        cols = _get_table_columns(cur, "checklist_items")
        text_col = next((c for c in ["question_text", "text"] if c in cols), "id")
        
        # Check if inspection_answers table has answer and checklist_item_id
        ans_cols = _get_table_columns(cur, "inspection_answers")
        has_ans = "answer" in ans_cols
        
        query = f"""
            SELECT ci.id, ci.{text_col}
            {", ia.answer" if has_ans else ""}
            FROM checklist_items ci
            LEFT JOIN inspection_answers ia ON ia.checklist_item_id = ci.id AND ia.inspection_id = %s
            WHERE ci.template_id = %s
            ORDER BY ci.id
        """
        cur.execute(query, (inspection_id, template_id))
        rows = cur.fetchall()
        
        data = []
        for r in rows:
            item = {"id": str(r[0]), "question_text": r[1]}
            if has_ans:
                item["answer"] = r[2]
            data.append(item)
            
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.post("/{inspection_id}/answers", response_model=dict)
def submit_answers(inspection_id: str, payload: AnswersBulkCreate):
    print("submit_answers HIT")
    print("inspection_id:", inspection_id)
    print("payload:", payload)
    """Bulk upsert answers for an inspection."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        ans_cols = _get_table_columns(cur, "inspection_answers")
        has_remark = "remark" in ans_cols
        
        for ans in payload.answers:
            # Simple check/upsert logic
            cur.execute(
                "SELECT id FROM inspection_answers WHERE inspection_id = %s AND checklist_item_id = %s",
                (inspection_id, ans.checklist_item_id)
            )
            existing = cur.fetchone()
            
            if existing:
                query = "UPDATE inspection_answers SET answer = %s" + (", remark = %s" if has_remark else "") + " WHERE id = %s"
                params = [ans.answer]
                if has_remark: params.append(ans.remark)
                params.append(existing[0])
                cur.execute(query, params)
            else:
                cols_str = "inspection_id, checklist_item_id, answer" + (", remark" if has_remark else "")
                placeholders = "%s, %s, %s" + (", %s" if has_remark else "")
                params = [inspection_id, ans.checklist_item_id, ans.answer]
                if has_remark: params.append(ans.remark)
                cur.execute(f"INSERT INTO inspection_answers ({cols_str}) VALUES ({placeholders})", params)
        
        conn.commit()
        return {"success": True, "message": "Answers saved successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
@router.get("/{inspection_id}", response_model=dict)
def get_inspection(inspection_id: str):
    """Get a single inspection with summary."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cols = _get_table_columns(cur, "inspections")
        name_col = next((c for c in ["project_name", "project"] if c in cols), "id")
        
        cur.execute(f"SELECT id, {name_col}, status, created_at FROM inspections WHERE id = %s", (inspection_id,))
        row = cur.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail=f"Inspection {inspection_id} not found")
        
        return {
            "success": True, 
            "data": {
                "id": str(row[0]),
                "project_name": row[1],
                "status": row[2],
                "created_at": str(row[3]) if row[3] else None
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
