from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.db import get_connection
from app.schemas.template import TemplateCreate, TemplateResponse

router = APIRouter()

def _get_table_columns(cur, table: str):
    cur.execute("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = %s
    """, (table,))
    return [row[0] for row in cur.fetchall()]

@router.post("/", response_model=dict)
def create_template(payload: TemplateCreate):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cols = _get_table_columns(cur, "templates")
        
        # Build adaptive INSERT based on user spec vs existing columns
        insert_cols = []
        insert_vals = []
        
        # Spec says: work_type, checklist_title
        if "work_type" in cols:
            insert_cols.append("work_type")
            insert_vals.append(payload.work_type)
            
        if "checklist_title" in cols:
            insert_cols.append("checklist_title")
            insert_vals.append(payload.checklist_title)
        elif "title" in cols:
            insert_cols.append("title")
            insert_vals.append(payload.checklist_title)
        elif "name" in cols:
            insert_cols.append("name")
            insert_vals.append(payload.checklist_title)

        if not insert_cols:
             raise HTTPException(status_code=500, detail="Could not map fields to existing templates table columns")

        col_str = ", ".join(insert_cols)
        placeholder_str = ", ".join(["%s"] * len(insert_vals))
        
        query = f"INSERT INTO templates ({col_str}) VALUES ({placeholder_str}) RETURNING id"
        cur.execute(query, insert_vals)
        new_id = cur.fetchone()[0]
        conn.commit()
        
        return {"success": True, "id": new_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.get("/", response_model=dict)
def list_templates():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cols = _get_table_columns(cur, "templates")
        # Try to find common label columns
        label_col = next((c for c in ["checklist_title", "title", "name"] if c in cols), "id")
        
        cur.execute(f"SELECT id, {label_col} FROM templates ORDER BY id DESC")
        rows = cur.fetchall()
        
        data = [{"id": r[0], "title": r[1]} for r in rows]
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
