import { useCallback, useState } from "react";
import type { Detection } from "../types/TakeoffPanel.types";
import { v4 as uuidv4 } from "uuid";
import type { UseBBoxDrawingParams as Params } from "../types/TakeoffPanel.types";

export function useBBoxDrawing({
  imgRef,
  zoom,
  scaleX,
  scaleY,
  editEnabled,
  detections,
  onChange,
  onSelect,
  onShowClassPicker,
  onDetectionsChange,
}: Params) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [tempBox, setTempBox] = useState<Detection["bbox"] | null>(null);

  /* ---------- BBox update ---------- */
  const updateBBox = useCallback(
    (id: string, bbox: Detection["bbox"]) => {
      onDetectionsChange(
        detections.map((d) => (d.id === id ? { ...d, bbox } : d)),
      );
    },
    [detections, onDetectionsChange],
  );

  const getRelativeCoords = useCallback(
    (e: React.MouseEvent) => {
      const rect = imgRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      };
    },
    [imgRef, zoom],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editEnabled || e.button !== 0) return;
    if ((e.target as HTMLElement).closest(".react-draggable")) return;

    const { x, y } = getRelativeCoords(e);
    onSelect(null);
    setStartPos({ x, y });
    setIsDrawing(true);
    setTempBox({ x1: x, y1: y, x2: x, y2: y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !tempBox) return;
    const { x, y } = getRelativeCoords(e);
    setTempBox({
      x1: Math.min(startPos.x, x),
      y1: Math.min(startPos.y, y),
      x2: Math.max(startPos.x, x),
      y2: Math.max(startPos.y, y),
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || !tempBox) return;

    const width = tempBox.x2 - tempBox.x1;
    const height = tempBox.y2 - tempBox.y1;
    if (width > 5 && height > 5) {
      const id = uuidv4();
      const detection: Detection = {
        id,
        class_id: -1,
        class_name: "New Item",
        confidence: 1,
        color: "#3b82f6",
        bbox: {
          x1: tempBox.x1 / scaleX,
          y1: tempBox.y1 / scaleY,
          x2: tempBox.x2 / scaleX,
          y2: tempBox.y2 / scaleY,
        },
      };
      onChange([...detections, detection]);
      onSelect(id);
      onShowClassPicker({ x: e.clientX, y: e.clientY, id });
    }
    setIsDrawing(false);
    setTempBox(null);
  };

  return {
    tempBox,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    updateBBox,
  };
}
