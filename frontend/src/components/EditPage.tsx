import { useState, useMemo, useCallback } from "react";
import type { Detection } from "../types/TakeoffPanel.types";
import type { EditProps as Props } from "../types/TakeoffPanel.types";
import { getColorFromId } from "../utils/colorUtils";

export default function EditPage({
  detections,
  setDetections,
  selectedId,
  onClose,
}: Props) {
  const [newClassName, setNewClassName] = useState("");
  const [isCustomClass, setIsCustomClass] = useState(false);

  const existingClasses = useMemo(() => {
    const map = new Map<string, number>();
    detections.forEach((d) => map.set(d.class_name, d.class_id));
    return Array.from(map.entries()).map(([name, id]) => ({ name, id }));
  }, [detections]);

  const maxClassId = useMemo(
    () => detections.reduce((max, d) => Math.max(max, d.class_id), 0),
    [detections],
  );

  const selectedItem = useMemo(
    () => detections.find((d) => d.id === selectedId),
    [detections, selectedId],
  );

  const handleAddItem = useCallback(() => {
    if (!newClassName.trim()) return;

    const existing = existingClasses.find((c) => c.name === newClassName);
    const classId = existing ? existing.id : maxClassId + 1;

    const newItem: Detection = {
      id: crypto.randomUUID(),
      class_name: newClassName.trim(),
      confidence: 1.0,
      bbox: { x1: 10, y1: 10, x2: 100, y2: 100 },
      class_id: classId,
      color: getColorFromId(classId),
    };

    setDetections([...detections, newItem]);
    setNewClassName("");
    setIsCustomClass(false);
  }, [newClassName, existingClasses, maxClassId, detections, setDetections]);

  const updateDetection = useCallback(
    (id: string, updates: Partial<Detection>) => {
      setDetections(
        detections.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      );
    },
    [detections, setDetections],
  );

  const updateBBox = useCallback(
    (id: string, key: keyof Detection["bbox"], value: number) => {
      setDetections(
        detections.map((d) =>
          d.id === id ? { ...d, bbox: { ...d.bbox, [key]: value } } : d,
        ),
      );
    },
    [detections, setDetections],
  );

  const updateGlobalClassColor = useCallback(
    (classId: number, color: string) => {
      setDetections(
        detections.map((d) => (d.class_id === classId ? { ...d, color } : d)),
      );
    },
    [detections, setDetections],
  );

  const renderClassInput = () => (
    <div className="space-y-2 mb-6 p-3 bg-white border rounded-lg shadow-sm">
      <label className="text-xs font-bold text-gray-500 uppercase">
        Add New Detection
      </label>
      <select
        value={isCustomClass ? "__new__" : newClassName}
        onChange={(e) => {
          const val = e.target.value;
          setIsCustomClass(val === "__new__");
          setNewClassName(val === "__new__" ? "" : val);
        }}
        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">Select an existing class...</option>
        {existingClasses.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
        <option value="__new__" className="text-blue-600 font-semibold">
          + Create New Class
        </option>
      </select>

      {isCustomClass && (
        <input
          autoFocus
          type="text"
          placeholder="Enter class name..."
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      )}

      <button
        onClick={handleAddItem}
        disabled={!newClassName}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 rounded-md transition-colors"
      >
        Add New Class
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full text-gray-800">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold">Detections</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {renderClassInput()}

      {!selectedItem ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
          <p>No detection selected</p>
          <p className="text-xs mt-1">
            Select a box on the preview to edit its properties.
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="bg-gray-50 border rounded-xl p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 mr-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                  Label
                </label>
                <input
                  type="text"
                  value={selectedItem.class_name}
                  onChange={(e) =>
                    updateDetection(selectedItem.id, {
                      class_name: e.target.value,
                    })
                  }
                  className="w-full border rounded px-2 py-1.5 font-semibold focus:bg-white"
                />
              </div>
              <button
                onClick={() =>
                  setDetections(detections.filter((d) => d.id !== selectedId))
                }
                className="mt-5 text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                title="Delete item"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                  Color Scheme
                </label>
                <div className="flex items-center gap-2 border bg-white rounded px-2 py-1">
                  <input
                    type="color"
                    className="w-6 h-6 border-none cursor-pointer bg-transparent"
                    value={
                      selectedItem.color ||
                      getColorFromId(selectedItem.class_id)
                    }
                    onChange={(e) =>
                      updateGlobalClassColor(
                        selectedItem.class_id,
                        e.target.value,
                      )
                    }
                  />
                  <span className="text-xs font-mono uppercase text-gray-500">
                    {selectedItem.color}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                  Confidence
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={selectedItem.confidence}
                  onChange={(e) =>
                    updateDetection(selectedItem.id, {
                      confidence: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border bg-white rounded px-2 py-1 text-sm h-[34px]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">
                Bounding Box Coordinates
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["x1", "y1", "x2", "y2"] as const).map((key) => (
                  <div key={key}>
                    <span className="text-[10px] text-gray-400 block text-center uppercase">
                      {key}
                    </span>
                    <input
                      type="number"
                      value={selectedItem.bbox[key]}
                      onChange={(e) =>
                        updateBBox(
                          selectedItem.id,
                          key,
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full border bg-white rounded px-1 py-1 text-xs text-center focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
