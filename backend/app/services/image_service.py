import os
import json
from PIL import Image
from fastapi import HTTPException
from app.core.config import settings, BASE_URL



def save_crop_service(
    project_id: str,
    page_index: int,
    crop: str,
):
    project_path = os.path.join(settings.UPLOAD_DIR, project_id)
    image_path = os.path.join(project_path, f"page_{page_index + 1}.png")

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Page image not found")

    crop_data = json.loads(crop)

    x = int(crop_data["x"])
    y = int(crop_data["y"])
    w = int(crop_data["width"])
    h = int(crop_data["height"])

    img = Image.open(image_path).convert("RGB")

    x2 = min(img.width, x + w)
    y2 = min(img.height, y + h)

    img = img.crop((x, y, x2, y2))

    cropped_path = os.path.join(project_path, f"page_{page_index + 1}_crop.png")
    img.save(cropped_path)

    cropped_url = f"{BASE_URL}/{project_id}/" f"{os.path.basename(cropped_path)}"

    return {"cropped_image": cropped_url}
