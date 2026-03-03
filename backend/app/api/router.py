from fastapi import APIRouter
from app.api.routes import (
    pdf_router,
    predict_router,
    detections_router,
    excel_router,
    image_router,
)

router = APIRouter()

router.include_router(pdf_router.router, tags=["PDF"])
router.include_router(image_router.router, tags=["Image"])
router.include_router(predict_router.router, tags=["Prediction"])
router.include_router(detections_router.router, tags=["Detections"])
router.include_router(excel_router.router, tags=["Excel"])
