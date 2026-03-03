import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Rnd } from "react-rnd";
import { getColorFromId } from "../utils/colorUtils";
import { useZoom } from "../hooks/useKeyboard";
import { useBBoxDrawing } from "../hooks/useBBoxDrawing";
import { useKeyboard } from "../hooks/useKeyboard";
import type { TakeOffRightPanelProps as Props } from "../types/TakeoffPanel.types";

export default function TakeoffRightPanel({
  image,
  detections,
  onDetectionsChange,
  selectedId,
  onSelect,
  editEnabled,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useZoom(containerRef);

  const [imgSize, setImgSize] = useState({
    naturalWidth: 1,
    naturalHeight: 1,
    renderedWidth: 1,
    renderedHeight: 1,
  });

  const scaleX = imgSize.renderedWidth / imgSize.naturalWidth;
  const scaleY = imgSize.renderedHeight / imgSize.naturalHeight;
  const [showClassPicker, setShowClassPicker] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);
  const [isCreatingNewClass, setIsCreatingNewClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  /* ---------- Resize handling ---------- */
  useEffect(() => {
    const handleResize = () => {
      if (!imgRef.current) return;
      setImgSize((prev) => ({
        ...prev,
        renderedWidth: imgRef.current!.width,
        renderedHeight: imgRef.current!.height,
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- Class helpers ---------- */
  const existingClasses = useMemo(() => {
    const map = new Map<number, string>();
    detections.forEach(
      (d) => d.class_id !== -1 && map.set(d.class_id, d.class_name),
    );
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [detections]);

  const maxClassId = useMemo(
    () => detections.reduce((max, d) => Math.max(max, d.class_id), -1),
    [detections],
  );

  const handleCancelPicker = useCallback(() => {
    if (showClassPicker) {
      onDetectionsChange(detections.filter((d) => d.id !== showClassPicker.id));
      onSelect("");
    }
    setShowClassPicker(null);
    setIsCreatingNewClass(false);
    setNewClassName("");
  }, [showClassPicker, detections, onDetectionsChange, onSelect]);

  const assignClassToDetection = useCallback(
    (detId: string, classId: number, className: string) => {
      onDetectionsChange(
        detections.map((d) =>
          d.id === detId
            ? {
                ...d,
                class_id: classId,
                class_name: className,
                color: getColorFromId(classId),
              }
            : d,
        ),
      );
      setShowClassPicker(null);
      setIsCreatingNewClass(false);
    },
    [detections, onDetectionsChange],
  );

  const handleCreateCustomClass = () => {
    if (!newClassName.trim() || !showClassPicker) return;
    assignClassToDetection(
      showClassPicker.id,
      maxClassId + 1,
      newClassName.trim(),
    );
    setNewClassName("");
  };

  /* ---------- Mouse Drawing ---------- */
  const {
    tempBox,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    updateBBox,
  } = useBBoxDrawing({
    imgRef,
    zoom,
    scaleX,
    scaleY,
    editEnabled,
    detections,
    onChange: onDetectionsChange,
    onSelect,
    onShowClassPicker: setShowClassPicker,
    onDetectionsChange,
  });

  /* ----------Keyboard ---------- */
  useKeyboard({
    selectedId,
    detections,
    editEnabled,
    isBlocked: !!showClassPicker,
    scaleX,
    scaleY,
    onChange: onDetectionsChange,
    onSelect,
    onZoom: setZoom,
  });

  return (
    <div
      className=" flex-1 flex flex-col bg-gray-100 p-8 h-full"
      ref={containerRef}
    >
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Preview</h1>

      <div className="flex-1 bg-white border rounded-lg shadow-lg p-4 overflow-auto relative">
        {image ? (
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="cursor-crosshair"
            style={{
              position: "relative",
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: "fit-content",
            }}
          >
            <img
              ref={imgRef}
              src={image}
              alt="Plan"
              className="block select-none pointer-events-none"
              onLoad={(e) => {
                const img = e.currentTarget;
                setImgSize({
                  naturalWidth: img.naturalWidth,
                  naturalHeight: img.naturalHeight,
                  renderedWidth: img.width,
                  renderedHeight: img.height,
                });
              }}
            />

            {tempBox && (
              <div
                style={{
                  position: "absolute",
                  left: tempBox.x1,
                  top: tempBox.y1,
                  width: tempBox.x2 - tempBox.x1,
                  height: tempBox.y2 - tempBox.y1,
                  border: "2px dashed #2563eb",
                  backgroundColor: "rgba(37, 99, 235, 0.1)",
                  zIndex: 1000,
                }}
              />
            )}

            {detections.map((det) => {
              const isSelected = selectedId === det.id;
              const color = isSelected ? "#eb0000" : det.color || "#ef4444";

              const width = (det.bbox.x2 - det.bbox.x1) * scaleX;
              const height = (det.bbox.y2 - det.bbox.y1) * scaleY;
              const x = det.bbox.x1 * scaleX;
              const y = det.bbox.y1 * scaleY;
              const fontSize = Math.max(5, Math.min(width, height) * 0.15);

              return (
                <Rnd
                  key={det.id}
                  bounds="parent"
                  scale={zoom}
                  size={{ width, height }}
                  position={{ x, y }}
                  enableResizing={editEnabled && isSelected}
                  disableDragging={!editEnabled}
                  onDragStart={() => onSelect(det.id)}
                  onDragStop={(_, d) =>
                    updateBBox(det.id, {
                      x1: d.x / scaleX,
                      y1: d.y / scaleY,
                      x2: (d.x + width) / scaleX,
                      y2: (d.y + height) / scaleY,
                    })
                  }
                  onResizeStop={(_, __, ref, ___, pos) =>
                    updateBBox(det.id, {
                      x1: pos.x / scaleX,
                      y1: pos.y / scaleY,
                      x2: (pos.x + ref.offsetWidth) / scaleX,
                      y2: (pos.y + ref.offsetHeight) / scaleY,
                    })
                  }
                  style={{
                    border: `${isSelected ? "2px" : "1px"} solid ${color}`,
                    boxSizing: "border-box",
                    zIndex: isSelected ? 100 : 1,
                    backgroundColor: isSelected
                      ? "rgba(37, 99, 235, 0.05)"
                      : "transparent",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -fontSize - 5,
                      left: -1,
                      fontSize,
                      color,
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                      pointerEvents: "none",
                      textShadow: "1px 1px 0px white",
                    }}
                  >
                    {det.class_name}
                  </div>
                </Rnd>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 italic">
            No image available
          </div>
        )}
      </div>

      {showClassPicker && (
        <div
          className="fixed z-9999 bg-white border border-gray-200 shadow-2xl rounded-lg overflow-hidden min-w-[220px]"
          style={{ top: showClassPicker.y, left: showClassPicker.x }}
        >
          <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Assign Class
            </span>
            <button
              onClick={handleCancelPicker}
              className="text-gray-400 hover:text-red-500 text-xl leading-none"
            >
              ×
            </button>
          </div>
          {!isCreatingNewClass ? (
            <div className="p-1">
              <div className="max-h-52 overflow-y-auto">
                {existingClasses.map((cls) => (
                  <button
                    key={cls.id}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-gray-700 text-sm rounded flex items-center gap-2 transition-colors"
                    onClick={() =>
                      assignClassToDetection(
                        showClassPicker.id,
                        cls.id,
                        cls.name,
                      )
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getColorFromId(cls.id) }}
                    />
                    {cls.name}
                  </button>
                ))}
              </div>
              <div className="mt-1 pt-1 border-t">
                <button
                  className="w-full text-left px-3 py-2 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded"
                  onClick={() => setIsCreatingNewClass(true)}
                >
                  + Add New Class
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <input
                autoFocus
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Category name..."
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleCreateCustomClass()
                }
              />
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded hover:bg-blue-700"
                  onClick={handleCreateCustomClass}
                >
                  Confirm
                </button>
                <button
                  className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded"
                  onClick={() => setIsCreatingNewClass(false)}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center gap-3 mt-4">
        <button
          className="bg-white border text-gray-600 w-10 h-10 rounded shadow hover:bg-gray-50 flex items-center justify-center font-bold"
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.2))}
        >
          −
        </button>
        <button
          className="bg-white border text-gray-600 px-4 h-10 rounded shadow hover:bg-gray-50 flex items-center justify-center text-sm font-medium"
          onClick={() => setZoom(1)}
        >
          Reset
        </button>
        <button
          className="bg-white border text-gray-600 w-10 h-10 rounded shadow hover:bg-gray-50 flex items-center justify-center font-bold"
          onClick={() => setZoom((z) => Math.min(z + 0.2, 4))}
        >
          +
        </button>
      </div>
    </div>
  );
}
