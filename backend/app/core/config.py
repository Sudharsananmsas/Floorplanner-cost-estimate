from pydantic import BaseSettings
import os
BASE_URL = "http://127.0.0.1:8000/static"

class Settings(BaseSettings):
    UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
    POPPLER_PATH: str | None = os.getenv("POPPLER_PATH", None)
    MODEL_PATH: str | None = os.getenv("MODEL_PATH", None)
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        env_file = ".env"


settings = Settings()
