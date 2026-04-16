from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.api.v1.api import api_router
from app.core.config import settings
from app.db import engine

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "message": "Welcome to ConstructHub Backend API",
        "project_name": settings.PROJECT_NAME
    }


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(content=b"", media_type="image/x-icon")


@app.get("/test-db")
def test_db():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as status"))
            row = result.fetchone()

        return {
            "success": True,
            "message": "Database connected successfully",
            "data": dict(row._mapping)
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@app.get("/test-read")
def test_read():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM inspections"))
            rows = result.fetchall()

        return {
            "success": True,
            "data": [dict(row._mapping) for row in rows]
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }