import LeftPanel from "../components/Leftpanel";

import RightPanel from "../components/Rightpanel";
import { usePlans } from "../hooks/useplans";
import { useNavigate } from "react-router-dom";

export default function PlansPage() {
  const {
    selectedFile,
    isConverting,
    projectId,
    images,
    currentIndex,
    setSelectedFile,
    setCurrentIndex,
    handleUpload,
    handlePredict,
  } = usePlans();

  const navigate = useNavigate();

  const doPredict = async (crop?: string) => {
    const data = await handlePredict(crop);

    navigate("/takeoff", {
      state: {
        annotatedImage: data.annotated_image,
        rows: data.counts,
        projectId,
        images,
        currentIndex,
      },
    });
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <LeftPanel
          onFileSelect={setSelectedFile}
          onConvert={handleUpload}
          hasFile={!!selectedFile}
          isConverting={isConverting}
          onClearFile={() => window.location.reload()}
        />

        <RightPanel
          projectId={projectId}
          images={images}
          currentIndex={currentIndex}
          onPageChange={setCurrentIndex}
          onPredict={doPredict}
        />
      </div>
    </>
  );
}
