from fastapi import APIRouter, HTTPException
from app.db import get_connection

router = APIRouter()


@router.get("/")
def get_inspections():
    """
    Get all checklists.
    """
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id, work_type, checklist_title, template_name,
                   project_name, due_date, assigned_to, status, created_at
            FROM checklists
            ORDER BY id DESC
        """)
        rows = cur.fetchall()

        result = []
        for row in rows:
            result.append({
                "id": row[0],
                "workType": row[1],
                "checklistTitle": row[2],
                "templateName": row[3],
                "projectName": row[4],
                "dueDate": str(row[5]) if row[5] else None,
                "assignedTo": row[6],
                "status": row[7],
                "createdAt": str(row[8]) if row[8] else None
            })

        return result

    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

    finally:
        cur.close()
        conn.close()


@router.post("/")
def create_inspection(inspection: dict):
    """
    Create checklist in checklists table.
    Questions are optional for now.
    """
    conn = get_connection()
    cur = conn.cursor()

    try:
        print("RECEIVED INSPECTION:", inspection)

        work_type = inspection.get("workType")
        checklist_title = inspection.get("checklistTitle")
        template_name = inspection.get("templateName")
        project_name = inspection.get("projectName")
        due_date = inspection.get("dueDate")
        assigned_to = inspection.get("assignedTo")
        status = inspection.get("status", "ASSIGNED")
        questions = inspection.get("questions") or []

        if not work_type or not checklist_title:
            raise HTTPException(
                status_code=400,
                detail="workType and checklistTitle are required"
            )

        # ✅ FIXED SQL BLOCK
        cur.execute("""
            INSERT INTO checklists (
                work_type,
                checklist_title,
                template_name,
                project_name,
                due_date,
                assigned_to,
                status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            work_type,
            checklist_title,
            template_name,
            project_name,
            due_date,
            assigned_to,
            status
        ))

        checklist_id = cur.fetchone()[0]

        # ✅ Insert questions if exist
        for index, question in enumerate(questions, start=1):
            cur.execute("""
                INSERT INTO checklist_questions (
                    checklist_id,
                    question_text,
                    question_order
                )
                VALUES (%s, %s, %s)
            """, (
                checklist_id,
                question,
                index
            ))

        conn.commit()

        return {
            "message": "Checklist created successfully",
            "checklistId": checklist_id
        }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as e:
        conn.rollback()
        print("INSERT ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cur.close()
        conn.close()


        conn.commit()

        return {
            "message": "Checklist created successfully",
            "checklistId": checklist_id
        }

@router.post("/submit")
def submit_inspection(payload: dict):
    """
    Save checklist answers for one checklist.
    """
    conn = get_connection()
    cur = conn.cursor()

    try:
        checklist_id = payload.get("checklistId")
        responses = payload.get("responses", [])
        overall_status = payload.get("status", "PENDING")

        if not checklist_id:
            raise HTTPException(status_code=400, detail="checklistId is required")

        if not isinstance(responses, list) or len(responses) == 0:
            raise HTTPException(status_code=400, detail="responses must be a non-empty list")

        for item in responses:
            question_id = item.get("id")
            answer = item.get("status")
            defect_type = item.get("defectType")
            remark = item.get("comment")

            if not question_id:
                continue

            cur.execute("""
                UPDATE checklist_questions
                SET answer = %s,
                    remark = %s,
                    question_type = %s
                WHERE id = %s AND checklist_id = %s
            """, (
                answer,
                remark,
                defect_type,
                question_id,
                checklist_id
            ))

        cur.execute("""
            UPDATE checklists
            SET status = %s
            WHERE id = %s
        """, (
            overall_status,
            checklist_id
        ))

        conn.commit()

        return {
            "message": "Inspection submitted successfully",
            "checklistId": checklist_id,
            "status": overall_status
        }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as e:
        conn.rollback()
        print("SUBMIT ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cur.close()
        conn.close()


@router.get("/checklist-items")
def get_all_checklist_items():
    """
    Temporary route to stop frontend 404 when no checklist_id is sent.
    """
    return [
        {"id": 1, "questionText": "Check concrete quality", "questionOrder": 1},
        {"id": 2, "questionText": "Check shuttering alignment", "questionOrder": 2},
        {"id": 3, "questionText": "Check reinforcement spacing", "questionOrder": 3}
    ]


@router.get("/checklist-items/{checklist_id}")
def get_checklist_items(checklist_id: int):
    """
    Get questions for one checklist.
    """
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id, question_text, question_order, question_type, options, answer, remark
            FROM checklist_questions
            WHERE checklist_id = %s
            ORDER BY question_order ASC
        """, (checklist_id,))

        rows = cur.fetchall()

        result = []
        for row in rows:
            result.append({
                "id": row[0],
                "questionText": row[1],
                "questionOrder": row[2],
                "questionType": row[3],
                "options": row[4],
                "answer": row[5],
                "remark": row[6]
            })

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cur.close()
        conn.close()