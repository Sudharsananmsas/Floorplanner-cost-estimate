import os
from uuid import uuid4
from fastapi import UploadFile


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


async def save_upload_file(upload_file: UploadFile, dest: str):
    contents = await upload_file.read()
    with open(dest, "wb") as f:
        f.write(contents)


def new_project_dir(base_dir: str):
    pid = uuid4().hex
    path = os.path.join(base_dir, pid)
    ensure_dir(path)
    return pid, path
