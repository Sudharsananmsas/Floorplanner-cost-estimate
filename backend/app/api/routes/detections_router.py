from fastapi import APIRouter
from app.services import detections_service

router = APIRouter()


@router.get("/detections/{project_id}/{page_index}")
async def get_detections(project_id: str, page_index: int):
    return detections_service.get_detections(project_id, page_index)


@router.post("/detections/{project_id}/{page_index}")
async def create_detections(project_id: str, page_index: int, payload: dict):
    detections_service.create_detections(project_id, page_index, payload)
    return {"message": "Detection JSON created"}


@router.put("/detections/{project_id}/{page_index}")
async def update_detections(project_id: str, page_index: int, payload: dict):
    detections_service.update_detections(project_id, page_index, payload)
    return {"message": "Detection JSON updated"}


@router.delete("/detections/{project_id}/{page_index}")
async def delete_detections(project_id: str, page_index: int):
    detections_service.delete_detections(project_id, page_index)
    return {"message": "Detection JSON deleted"}
