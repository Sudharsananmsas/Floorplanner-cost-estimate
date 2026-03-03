import { useState, useEffect } from "react";
import { uploadPdf, predict } from "../services/plan.service";
import { useLocation } from "react-router-dom";

export function usePlans() {
  const [projectId, setProjectId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsConverting(true);

    const data = await uploadPdf(selectedFile);

    setProjectId(data.project_id);
    setImages(data.images);
    setCurrentIndex(0);
    setIsConverting(false);
  };
  const location = useLocation() as any;

  const handlePredict = async (crop?: string) => {
    return predict(projectId, currentIndex, crop);
  };

  useEffect(() => {
    if (location.state) {
      setProjectId(location.state.projectId || "");
      setImages(location.state.images || []);
      setCurrentIndex(location.state.currentIndex || 0);
    }
  }, [location.state]);
  return {
    projectId,
    images,
    currentIndex,
    selectedFile,
    isConverting,
    setSelectedFile,
    setCurrentIndex,
    handleUpload,
    handlePredict,
  };
}
