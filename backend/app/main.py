from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
from app.services.supabase_service import supabase_client

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


@app.get("/test-insert")
def test_insert():
    try:
        response = supabase_client.table("inspections").insert({
            "site_name": "Test Site",
            "status": "pending"
        }).execute()

        return {
            "success": True,
            "message": "Data inserted successfully",
            "data": response.data
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@app.get("/test-read")
def test_read():
    try:
        response = supabase_client.table("inspections").select("*").execute()

        return {
            "success": True,
            "data": response.data
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
