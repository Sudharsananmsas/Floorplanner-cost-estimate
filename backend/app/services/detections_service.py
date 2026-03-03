import os
import json
from typing import Dict, Any
from fastapi import HTTPException
from app.core.config import settings
from app.utils.file_utils import ensure_dir


def _get_json_path(project_id: str, page_index: int) -> str:
    return os.path.join(
        settings.UPLOAD_DIR,
        project_id,
        f"page_{page_index + 1}_detections.json",
    )


def get_detections(project_id: str, page_index: int) -> Dict[str, Any]:
    json_path = _get_json_path(project_id, page_index)

    if not os.path.exists(json_path):
        raise HTTPException(status_code=404, detail="JSON not found")

    with open(json_path, "r") as f:
        return json.load(f)


def create_detections(
    project_id: str,
    page_index: int,
    payload: Dict[str, Any],
) -> None:
    project_path = os.path.join(settings.UPLOAD_DIR, project_id)
    ensure_dir(project_path)

    json_path = _get_json_path(project_id, page_index)

    with open(json_path, "w") as f:
        json.dump(payload, f, indent=4)


def update_detections(
    project_id: str,
    page_index: int,
    payload: Dict[str, Any],
) -> None:
    json_path = _get_json_path(project_id, page_index)

    if not os.path.exists(json_path):
        raise HTTPException(status_code=404, detail="JSON not found")

    with open(json_path, "w") as f:
        json.dump(payload, f, indent=4)


def delete_detections(project_id: str, page_index: int) -> None:
    json_path = _get_json_path(project_id, page_index)

    if not os.path.exists(json_path):
        raise HTTPException(status_code=404, detail="JSON not found")

    os.remove(json_path)
