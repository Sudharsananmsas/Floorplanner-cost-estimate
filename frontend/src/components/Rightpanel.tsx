import { useState, useRef, useEffect } from "react";
import ImageCropper from "./ImageCropper";
import { saveCrop } from "../services/plan.service";
import type { RightPanelProps } from "../types/Plans.types";
import { useZoom } from "../hooks/useKeyboard";

export default function RightPanel({
  projectId,
  images,
  currentIndex,
  onPageChange,
  onPredict,
}: RightPanelProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useZoom(containerRef);
  const [isCropping, setIsCropping] = useState(false);
  const [tempCrop, setTempCrop] = useState<any>(null);
  const [savedCrop, setSavedCrop] = useState<any>(null);
  const [localImages, setLocalImages] = useState<string[]>(images);

  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  const currentImage =
    localImages.length > 0 ? localImages[currentIndex] : null;
  const handleSaveCrop = async () => {
    if (!tempCrop) return;

    setSavedCrop(tempCrop);
    setIsCropping(false);

    const res = await saveCrop(projectId, currentIndex, tempCrop);
    const url = res.cropped_image + `?t=${Date.now()}`;

    setLocalImages((prev) => {
      const copy = [...prev];
      copy[currentIndex] = url;
      return copy;
    });
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setTempCrop(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100 p-8 h-full">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Preview</h1>
      <div className="flex justify-end w-full pr-4 mb-2 gap-2">
        {!isCropping ? (
          <button
            onClick={() => setIsCropping(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            Crop
          </button>
        ) : (
          <>
            <button
              onClick={handleSaveCrop}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save Crop
            </button>
            <button
              onClick={handleCancelCrop}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <div
        ref={containerRef}
        className="flex-1 bg-white border rounded-lg shadow-lg p-4 flex justify-center items-center overflow-auto max-h-[90vh]"
      >
        {!currentImage ? (
          <p className="text-gray-500 text-lg">Upload a PDF and Convert it.</p>
        ) : (
          <div className="relative w-[90%] h-[60vh] flex justify-center items-center">
            {!isCropping && (
              <img
                src={currentImage}
                ref={imgRef}
                className="max-w-full max-h-full  transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
              />
            )}

            {isCropping && (
              <div
                className="absolute inset-0 z-10"
                style={{ transform: `scale(${zoom})` }}
              >
                <ImageCropper
                  image={currentImage}
                  onCropComplete={setTempCrop}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center gap-3 mt-3">
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
          className="bg-gray-200 px-3 py-1 rounded shadow"
        >
          −
        </button>
        <button
          onClick={() => setZoom(1)}
          className="bg-gray-200 px-3 py-1 rounded shadow"
        >
          Reset
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
          className="bg-gray-200 px-3 py-1 rounded shadow"
        >
          +
        </button>
      </div>

      {images.length > 0 && (
        <div className="mt-10 w-full">
          <div className="flex justify-center items-center gap-6 mb-6">
            <button
              onClick={() => onPageChange(currentIndex - 1)}
              disabled={currentIndex === 0}
              className={`px-5 py-2 rounded-xl font-medium transition-all shadow 
          ${
            currentIndex === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
            >
              Prev
            </button>

            <span className="text-gray-700 font-semibold text-lg">
              Page {currentIndex + 1} of {images.length}
            </span>

            <button
              onClick={() => onPageChange(currentIndex + 1)}
              disabled={currentIndex === images.length - 1}
              className={`px-5 py-2 rounded-xl font-medium transition-all shadow 
          ${
            currentIndex === images.length - 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
            >
              Next
            </button>
          </div>

          <div className="flex justify-end w-full pr-4">
            <button
              onClick={() =>
                onPredict(savedCrop ? JSON.stringify(savedCrop) : undefined)
              }
              disabled={!projectId}
              className={`px-6 py-2 rounded-xl font-semibold transition-all shadow 
          ${
            !projectId
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
          }`}
            >
              Predict
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
