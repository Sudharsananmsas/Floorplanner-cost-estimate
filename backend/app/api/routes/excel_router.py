from fastapi import APIRouter
from fastapi.responses import FileResponse
import pandas as pd
from uuid import uuid4
import os

router = APIRouter()


@router.post("/export")
async def export_excel(payload: dict):
    rows = payload.get("rows", [])
    df = pd.DataFrame(rows)
    out_path = os.path.join(
        "/tmp" if os.name != "nt" else ".", f"{uuid4().hex}_takeoff.xlsx"
    )
    df.to_excel(out_path, index=False)
    return FileResponse(out_path, filename="takeoff.xlsx")
