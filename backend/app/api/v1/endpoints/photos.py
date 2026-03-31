from fastapi import APIRouter
from typing import List
from app.schemas.photo import Photo, PhotoCreate
from app.services.supabase_service import supabase_client

router = APIRouter()

@router.get("/", response_model=List[Photo])
def get_photos():
    """Get all photos."""
    response = supabase_client.table("photos").select("*").execute()
    photos = []
    for item in response.data:
        photos.append(
            Photo(
                id=str(item.get("id", "")),
                file_path=item.get("file_path", ""),
                related_type=item.get("related_type", ""),
                related_id=item.get("related_id", ""),
                caption=item.get("caption", ""),
            )
        )
    return photos

@router.post("/")
def create_photo(photo: PhotoCreate):
    """Create a new photo record."""
    data = {
        "file_path": photo.file_path,
        "related_type": photo.related_type,
        "related_id": photo.related_id,
        "caption": photo.caption,
    }
    response = supabase_client.table("photos").insert(data).execute()
    return response.data[0] if response.data else {}
