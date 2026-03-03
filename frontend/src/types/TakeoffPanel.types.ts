import type { RefObject } from "react";

export type Detection = {
  id: string;
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: { x1: number; y1: number; x2: number; y2: number };
  color: string;
};

export interface TakeOffLeftPanelRowData {
  label: string;
  qty: number;
}

export interface TakeOffLeftPanelProps {
  rows?: TakeOffLeftPanelRowData[];
  detections?: { class_name: string }[];
  onBack: () => void;
}

export interface TakeOffRightPanelProps {
  image: string | null;
  detections: Detection[];
  editEnabled: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDetectionsChange: (newDetections: Detection[]) => void;
}
export interface UseKeyboardParams {
  selectedId: string | null;
  detections: Detection[];
  editEnabled: boolean;
  isBlocked: boolean;
  scaleX: number;
  scaleY: number;
  onZoom?: (fn: (z: number) => number) => void;
  onChange: (d: Detection[]) => void;
  onSelect: (id: string | null) => void;
}

export interface UseBBoxDrawingParams {
  imgRef: RefObject<HTMLImageElement | null>;
  zoom: number;
  scaleX: number;
  scaleY: number;
  editEnabled: boolean;
  detections: Detection[];
  onChange: (d: Detection[]) => void;
  onSelect: (id: string | null) => void;
  onShowClassPicker: (p: { x: number; y: number; id: string }) => void;
  onDetectionsChange: (newDetections: Detection[]) => void;
}

export interface EditProps {
  projectId: string;
  pageIndex: number;
  detections: Detection[];
  selectedId: string | null;
  setDetections: (d: Detection[]) => void;
  onClose: () => void;
}
