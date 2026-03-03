import { useEffect, useState } from "react";
import type { UseKeyboardParams as Params } from "../types/TakeoffPanel.types";
import type { RefObject, Dispatch, SetStateAction } from "react";

export function useKeyboard({
  selectedId,
  detections,
  editEnabled,
  isBlocked,
  scaleX,
  scaleY,
  onChange,
  onSelect,
  onZoom,
}: Params) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (onZoom) {
        if (e.key === "+" || e.key === "=") onZoom((z) => Math.min(z + 0.2, 4));
        if (e.key === "-") onZoom((z) => Math.max(z - 0.2, 0.2));
        if (e.key === "0") onZoom(() => 1);
      }
      if (!selectedId || !editEnabled || isBlocked) return;
      const selected = detections.find((d) => d.id === selectedId);
      if (e.key === "Delete") {
        onChange(detections.filter((d) => d.id !== selectedId));
        onSelect(null);
      }
      if (e.key === "Escape") {
        onSelect(null);
      }
      if (e.key === "Tab") {
        e.preventDefault();
        if (!detections.length) return;
        const index = detections.findIndex((d) => d.id === selectedId);
        const next = e.shiftKey
          ? detections[(index - 1 + detections.length) % detections.length]
          : detections[(index + 1) % detections.length];
        onSelect(next.id);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selected) {
        e.preventDefault();
        onChange([
          ...detections,
          { ...selected, id: crypto.randomUUID(), bbox: { ...selected.bbox } },
        ]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedId,
    detections,
    editEnabled,
    isBlocked,
    onSelect,
    onChange,
    onZoom,
    scaleX,
    scaleY,
  ]);
}

/* ---------- Zoom (Ctrl + Wheel) ---------- */
export function useZoom(
  containerRef: RefObject<HTMLDivElement | null>,
): [number, Dispatch<SetStateAction<number>>] {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom((z) =>
        Math.min(4, Math.max(0.2, z + (e.deltaY > 0 ? -0.1 : 0.1))),
      );
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [containerRef]);
  return [zoom, setZoom];
}
