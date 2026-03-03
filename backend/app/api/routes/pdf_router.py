from fastapi import APIRouter, UploadFile, File, HTTPException
import os

from app.core.config import settings, BASE_URL
from app.services.pdf_service import pdf_to_images
from app.utils.file_utils import new_project_dir, save_upload_file

router = APIRouter()



@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    pid, project_path = new_project_dir(settings.UPLOAD_DIR)

    filename = file.filename or f"{pid}.pdf"
    pdf_path = os.path.join(project_path, filename)
    await save_upload_file(file, pdf_path)

    try:
        images = pdf_to_images(pdf_path, project_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    urls = [f"{BASE_URL}/{pid}/{os.path.basename(p)}" for p in images]

    return {"project_id": pid, "images": urls}
