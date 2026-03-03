from fastapi import APIRouter, Form
from app.services.predict_service import run_prediction

router = APIRouter()


@router.post("/predict")
async def predict(
    project_id: str = Form(...),
    page_index: int = Form(...),
    crop: str | None = Form(None),
):
    return run_prediction(
        project_id=project_id,
        page_index=page_index,
        crop=crop,
    )
