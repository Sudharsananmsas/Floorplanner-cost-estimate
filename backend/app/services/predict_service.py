import os
import json
from uuid import uuid4
from PIL import Image
from fastapi import HTTPException

from app.core.config import settings, BASE_URL
from app.utils.file_utils import ensure_dir
from app.services.model_service import predict_image


def run_prediction(
    project_id: str,
    page_index: int,
    crop: str | None = None,
):
    project_path = os.path.join(settings.UPLOAD_DIR, project_id)
    ensure_dir(project_path)

    image_path = os.path.join(project_path, f"page_{page_index + 1}.png")
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Page image not found")

    img = Image.open(image_path).convert("RGB")

    if crop:
        try:
            c = json.loads(crop)
            img = img.crop((c["x"], c["y"], c["x"] + c["width"], c["y"] + c["height"]))
            image_path = os.path.join(project_path, f"page_{page_index + 1}_crop.png")
            img.save(image_path)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    annotated_path = os.path.join(project_path, f"page_{page_index + 1}_annotated.png")
    json_path = os.path.join(project_path, f"page_{page_index + 1}_detections.json")

    try:
        _, _, json_data = predict_image(image_path, annotated_path, json_path)

        project_url = f"{BASE_URL}/{project_id}"

        if "image" in json_data:
            json_data["image"] = f"{project_url}/{json_data['image']}"

        if "output_image" in json_data:
            json_data["output_image"] = f"{project_url}/{json_data['output_image']}"

        # Add unique IDs for frontend
        for d in json_data.get("detections", []):
            d["id"] = str(uuid4())

        # Save JSON
        with open(json_path, "w") as f:
            json.dump(json_data, f, indent=4)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "raw_image": json_data.get("image"),
        "annotated_image": json_data.get("output_image"),
        "detections": json_data,
        "json_url": f"{project_url}/{os.path.basename(json_path)}",
    }
