import type { PixelCrop } from "react-image-crop";

export interface LeftPanelProps {
  onFileSelect: (file: File | null) => void;
  onConvert: () => void;
  hasFile: boolean;
  isConverting: boolean;
  onClearFile: () => void;
}

export interface RightPanelProps {
  projectId: string;
  images: string[];
  currentIndex: number;
  onPageChange: (idx: number) => void;
  onPredict: (crop?: any) => void;
}

export interface ImageCropperProps {
  image: string;
  onCropComplete: (crop: PixelCrop) => void;
}
