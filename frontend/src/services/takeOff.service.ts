import api from "../config/axiosConfig";

export async function getDetections(projectId: string, pageIndex: number) {
  const res = await api.get(`/detections/${projectId}/${pageIndex}`);
  return res.data;
}

export async function createDetections(
  projectId: string,
  pageIndex: number,
  payload: any,
) {
  const res = await api.post(`/detections/${projectId}/${pageIndex}`, payload);
  return res.data;
}

export async function updateDetections(
  projectId: string,
  pageIndex: number,
  payload: any,
) {
  const res = await api.put(`/detections/${projectId}/${pageIndex}`, payload);
  return res.data;
}

export async function deleteDetections(projectId: string, pageIndex: number) {
  const res = await api.delete(`/detections/${projectId}/${pageIndex}`);
  return res.data;
}

export async function exportExcel(rows: any[]) {
  const res = await api.post("/export", { rows }, { responseType: "blob" });

  const blob = new Blob([res.data]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "takeoff.xlsx";
  a.click();

  window.URL.revokeObjectURL(url);
}
