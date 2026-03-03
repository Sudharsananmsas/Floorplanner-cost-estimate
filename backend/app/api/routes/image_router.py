from fastapi import APIRouter, Form
from app.services.image_service import save_crop_service

router = APIRouter()


@router.post("/save-crop")
async def save_crop(
    project_id: str = Form(...),
    page_index: int = Form(...),
    crop: str = Form(...),
):
    return save_crop_service(
        project_id=project_id,
        page_index=page_index,
        crop=crop,
    )
