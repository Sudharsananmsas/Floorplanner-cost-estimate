from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.router import router
from app.core.config import settings
import os

app = FastAPI(title="FloorPlan Takeoff API")

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/static",
    StaticFiles(directory=os.path.abspath(settings.UPLOAD_DIR)),
    name="static",
)


app.include_router(router, prefix="/api")
