import api from "../config/axiosConfig";

export async function uploadPdf(file: File) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await api.post("/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export async function saveCrop(
  project_id: string,
  page_index: number,
  crop: any
) {
  const fd = new FormData();
  fd.append("project_id", project_id);
  fd.append("page_index", page_index.toString());
  fd.append("crop", JSON.stringify(crop));

  const res = await api.post("/save-crop", fd);
  return res.data;
}

export async function predict(
  projectId: string,
  pageIndex: number,
  crop?: string
) {
  const fd = new FormData();
  fd.append("project_id", projectId);
  fd.append("page_index", pageIndex.toString());
  if (crop) {
    fd.append("crop", crop);
  }
  const res = await api.post("/predict", fd);
  return res.data;
}
