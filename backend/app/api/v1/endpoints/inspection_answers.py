from fastapi import APIRouter, HTTPException
from app.db import get_connection
from app.schemas.inspection_answer import InspectionAnswerCreate

router = APIRouter()

@router.post("/", response_model=dict)
def save_inspection_answer(payload: InspectionAnswerCreate):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO inspection_answers (inspection_id, checklist_item_id, answer) VALUES (%s, %s, %s) RETURNING id",
            (payload.inspection_id, payload.checklist_item_id, payload.answer)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        return {"success": True, "answer_id": new_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
