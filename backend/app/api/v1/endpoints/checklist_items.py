from fastapi import APIRouter, HTTPException
from typing import List
from app.db import get_connection
from app.schemas.checklist_item import ChecklistItemCreate

router = APIRouter()

def _get_table_columns(cur, table: str):
    cur.execute("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = %s
    """, (table,))
    return [row[0] for row in cur.fetchall()]

@router.post("/", response_model=dict)
def create_checklist_item(payload: ChecklistItemCreate):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cols = _get_table_columns(cur, "checklist_items")
        insert_cols = ["template_id"]
        insert_vals = [payload.template_id]
        
        # Spec: question_text, order_index, answer_type
        if "question_text" in cols:
            insert_cols.append("question_text")
            insert_vals.append(payload.question_text)
        elif "text" in cols:
            insert_cols.append("text")
            insert_vals.append(payload.question_text)
            
        if "order_index" in cols and payload.order_index is not None:
            insert_cols.append("order_index")
            insert_vals.append(payload.order_index)
            
        if "answer_type" in cols:
            insert_cols.append("answer_type")
            insert_vals.append(payload.answer_type)

        col_str = ", ".join(insert_cols)
        placeholder_str = ", ".join(["%s"] * len(insert_vals))
        
        cur.execute(f"INSERT INTO checklist_items ({col_str}) VALUES ({placeholder_str}) RETURNING id", insert_vals)
        new_id = cur.fetchone()[0]
        conn.commit()
        return {"success": True, "id": new_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.get("/templates/{template_id}/items", response_model=dict)
def get_template_items(template_id: str):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cols = _get_table_columns(cur, "checklist_items")
        text_col = next((c for c in ["question_text", "text", "label"] if c in cols), "id")
        order_col = next((c for c in ["order_index", "item_order", "id"] if c in cols), "id")
        
        cur.execute(f"SELECT id, {text_col} FROM checklist_items WHERE template_id = %s ORDER BY {order_col}", (template_id,))
        rows = cur.fetchall()
        data = [{"id": r[0], "question_text": r[1]} for r in rows]
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
