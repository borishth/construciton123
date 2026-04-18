from fastapi import APIRouter, HTTPException
from app.db import get_connection
from app.schemas.inspection_v2 import InspectionV2Create, AnswersBulkCreate

router = APIRouter()


# ─── Helpers ────────────────────────────────────────────────────────────────────

def _get_cols(cur, table: str):
    cur.execute("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = %s
        ORDER BY ordinal_position
    """, (table,))
    return [row[0] for row in cur.fetchall()]


# ─── Inspections ────────────────────────────────────────────────────────────────

@router.get("/")
def list_inspections():
    """List all inspections."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cols = _get_cols(cur, "inspections")
        select_cols = ["id"] + [c for c in [
            "template_id", "project_name", "assigned_to", "due_date", "status", "created_at"
        ] if c in cols]

        cur.execute(f"SELECT {', '.join(select_cols)} FROM inspections ORDER BY id DESC")
        rows = cur.fetchall()

        result = []
        for row in rows:
            obj = {}
            for i, col in enumerate(select_cols):
                val = row[i]
                obj[col] = str(val) if val is not None else None
            result.append(obj)

        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.post("/")
def create_inspection(payload: InspectionV2Create):
    """Create an inspection linked to a template_id. Returns inspection_id."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cols = _get_cols(cur, "inspections")

        insert_cols = ["template_id"]
        insert_vals = [payload.template_id]

        optional_fields = {
            "project_name": payload.project_name,
            "assigned_to": payload.assigned_to,
            "due_date": payload.due_date,
            "status": payload.status or "PENDING",
        }
        for col, val in optional_fields.items():
            if col in cols and val is not None:
                insert_cols.append(col)
                insert_vals.append(val)

        placeholders = ", ".join(["%s"] * len(insert_vals))
        col_str = ", ".join(insert_cols)

        cur.execute(
            f"INSERT INTO inspections ({col_str}) VALUES ({placeholders}) RETURNING id",
            insert_vals
        )
        inspection_id = cur.fetchone()[0]
        conn.commit()

        return {
            "success": True,
            "message": "Inspection created successfully",
            "data": {"inspection_id": inspection_id, "template_id": payload.template_id}
        }

    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.get("/{inspection_id}/items")
def get_inspection_items(inspection_id: int):
    """
    Load checklist items for an inspection by joining:
    inspections.template_id -> checklist_items.template_id
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Get the template_id for this inspection
        cur.execute("SELECT template_id FROM inspections WHERE id = %s", (inspection_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Inspection {inspection_id} not found")
        template_id = row[0]

        # Find actual column names in checklist_items
        item_cols = _get_cols(cur, "checklist_items")
        text_col = next((c for c in ["question_text", "item_text", "text", "question", "label"] if c in item_cols), None)
        order_col = next((c for c in ["item_order", "order", "sort_order", "question_order"] if c in item_cols), None)

        select_parts = ["ci.id", "ci.template_id"]
        if text_col:
            select_parts.append(f"ci.{text_col}")
        if order_col:
            select_parts.append(f"ci.{order_col}")

        # Also check if there's an existing answer for this inspection
        ans_cols = _get_cols(cur, "inspection_answers")
        has_answer_col = "answer" in ans_cols
        has_remark_col = "remark" in ans_cols

        if has_answer_col:
            select_parts.append("ia.answer")
        if has_remark_col:
            select_parts.append("ia.remark")

        query = f"""
            SELECT {', '.join(select_parts)}
            FROM checklist_items ci
            LEFT JOIN inspection_answers ia
                ON ia.checklist_item_id = ci.id AND ia.inspection_id = %s
            WHERE ci.template_id = %s
        """
        if order_col:
            query += f" ORDER BY ci.{order_col} ASC"
        else:
            query += " ORDER BY ci.id ASC"

        cur.execute(query, (inspection_id, template_id))
        rows = cur.fetchall()

        result = []
        for row in rows:
            obj = {"id": row[0], "template_id": row[1]}
            idx = 2
            if text_col:
                obj["question_text"] = row[idx]
                idx += 1
            if order_col:
                obj["item_order"] = row[idx]
                idx += 1
            if has_answer_col:
                obj["answer"] = row[idx]
                idx += 1
            if has_remark_col:
                obj["remark"] = row[idx]
            result.append(obj)

        return {"success": True, "data": result, "inspection_id": inspection_id, "template_id": template_id}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.post("/{inspection_id}/answers")
def submit_answers(inspection_id: int, payload: AnswersBulkCreate):
    """
    Upsert answers into inspection_answers table.
    Each answer: checklist_item_id, answer ('Yes'/'No'/'N/A'), remark (optional)
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Verify inspection exists
        cur.execute("SELECT id, template_id FROM inspections WHERE id = %s", (inspection_id,))
        insp = cur.fetchone()
        if not insp:
            raise HTTPException(status_code=404, detail=f"Inspection {inspection_id} not found")

        ans_cols = _get_cols(cur, "inspection_answers")
        has_remark = "remark" in ans_cols

        pass_count = fail_count = na_count = 0

        for item in payload.answers:
            answer_val = item.answer
            if answer_val == "Yes":
                pass_count += 1
            elif answer_val == "No":
                fail_count += 1
            else:
                na_count += 1

            # Try UPSERT — check if row exists first
            cur.execute(
                "SELECT id FROM inspection_answers WHERE inspection_id = %s AND checklist_item_id = %s",
                (inspection_id, item.checklist_item_id)
            )
            existing = cur.fetchone()

            if existing:
                if has_remark:
                    cur.execute(
                        "UPDATE inspection_answers SET answer = %s, remark = %s WHERE id = %s",
                        (answer_val, item.remark, existing[0])
                    )
                else:
                    cur.execute(
                        "UPDATE inspection_answers SET answer = %s WHERE id = %s",
                        (answer_val, existing[0])
                    )
            else:
                if has_remark:
                    cur.execute(
                        "INSERT INTO inspection_answers (inspection_id, checklist_item_id, answer, remark) VALUES (%s, %s, %s, %s)",
                        (inspection_id, item.checklist_item_id, answer_val, item.remark)
                    )
                else:
                    cur.execute(
                        "INSERT INTO inspection_answers (inspection_id, checklist_item_id, answer) VALUES (%s, %s, %s)",
                        (inspection_id, item.checklist_item_id, answer_val)
                    )

        # Update inspection overall status
        overall_status = "FAIL" if fail_count > 0 else "PASS"
        insp_cols = _get_cols(cur, "inspections")
        if "status" in insp_cols:
            cur.execute(
                "UPDATE inspections SET status = %s WHERE id = %s",
                (overall_status, inspection_id)
            )

        conn.commit()

        return {
            "success": True,
            "message": "Answers saved successfully",
            "data": {
                "inspection_id": inspection_id,
                "status": overall_status,
                "summary": {
                    "total": len(payload.answers),
                    "passed": pass_count,
                    "failed": fail_count,
                    "na": na_count
                }
            }
        }

    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.get("/{inspection_id}")
def get_inspection(inspection_id: int):
    """Get a single inspection with summary."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cols = _get_cols(cur, "inspections")
        select_cols = ["id"] + [c for c in [
            "template_id", "project_name", "assigned_to", "due_date", "status", "created_at"
        ] if c in cols]

        cur.execute(f"SELECT {', '.join(select_cols)} FROM inspections WHERE id = %s", (inspection_id,))
        row = cur.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail=f"Inspection {inspection_id} not found")

        obj = {}
        for i, col in enumerate(select_cols):
            val = row[i]
            obj[col] = str(val) if val is not None else None

        return {"success": True, "data": obj}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
