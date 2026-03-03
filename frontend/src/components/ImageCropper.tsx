import { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import type { Crop, PixelCrop, PercentCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import type { ImageCropperProps as Props } from "../types/Plans.types";

export default function ImageCropper({ image, onCropComplete }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: 200,
    y: 200,
    width: 600,
    height: 600,
  });

  const handleComplete = (pixelCrop: PixelCrop, _percentCrop: PercentCrop) => {
    const img = imgRef.current;
    if (!img || !pixelCrop.width || !pixelCrop.height) return;

    const rect = img.getBoundingClientRect();

    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const realCrop: PixelCrop = {
      x: Math.round(pixelCrop.x * scaleX),
      y: Math.round(pixelCrop.y * scaleY),
      width: Math.round(pixelCrop.width * scaleX),
      height: Math.round(pixelCrop.height * scaleY),
      unit: "px",
    };

    onCropComplete(realCrop);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={handleComplete}
        keepSelection
      >
        <img
          ref={imgRef}
          src={image}
          alt="Crop target"
          style={{ maxHeight: "75vh", width: "auto" }}
        />
      </ReactCrop>
    </div>
  );
}
