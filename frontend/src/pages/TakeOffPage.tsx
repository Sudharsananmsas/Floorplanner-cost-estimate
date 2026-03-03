import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TakeoffLeftPanel from "../components/TakeoffLeftPanel";
import TakeoffRightPanel from "../components/TakeoffRightPanel";
import EditPage from "../components/EditPage";
import { predict } from "../services/plan.service";
import {
  getDetections,
  createDetections,
  updateDetections,
} from "../services/takeOff.service";
import type { Detection } from "../types/TakeoffPanel.types";
import { getColorFromId } from "../utils/colorUtils";

export default function TakeOffPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as any;

  const projectId = state?.projectId || "";
  const images = state?.images || [];
  const currentIndex = state?.currentIndex || 0;

  const [detections, setDetections] = useState<Detection[]>([]);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let data;
        try {
          data = await getDetections(projectId, currentIndex);
        } catch (err: any) {
          if (err.response?.status !== 404) throw err;

          const pred = await predict(projectId, currentIndex);
          data = {
            image: pred.raw_image,
            output_image: pred.annotated_image,
            detections: pred.detections,
          };
          await createDetections(projectId, currentIndex, data);
        }

        const classColors: Record<number, string> = {};
        const coloredDetections = data.detections.map((d: any) => {
          if (!classColors[d.class_id]) {
            classColors[d.class_id] = getColorFromId(d.class_id);
          }
          return { ...d, color: classColors[d.class_id] };
        });

        setDetections(coloredDetections);
        setRawImage(data.image);
        setAnnotatedImage(data.output_image);
        setDirty(false);
      } catch (e) {
        console.error("Failed to load detections:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [projectId, currentIndex]);

  /* ---------- SAVE ---------- */
  const saveDetections = async () => {
    setSaving(true);

    try {
      const payload = {
        image: rawImage,
        output_image: annotatedImage,
        detections: detections.map(({ color, ...d }) => d),
      };

      await updateDetections(projectId, currentIndex, payload);
      setDirty(false);
      alert("Saved successfully");
    } catch (e) {
      console.error("Save failed:", e);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="flex h-screen relative">
      <TakeoffLeftPanel
        detections={detections}
        onBack={() =>
          navigate("/plans", { state: { projectId, images, currentIndex } })
        }
      />

      <TakeoffRightPanel
        image={rawImage}
        detections={detections}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onDetectionsChange={(d) => {
          setDetections(d);
          setDirty(true);
        }}
        editEnabled={showEdit}
      />

      {showEdit && (
        <div className="absolute top-4 right-4 w-96 bg-white p-4 shadow">
          <EditPage
            projectId={projectId}
            pageIndex={currentIndex}
            detections={detections}
            selectedId={selectedId}
            setDetections={(d) => {
              setDetections(d);
              setDirty(true);
            }}
            onClose={() => setShowEdit(false)}
          />
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setShowEdit((s) => !s)}
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          {showEdit ? "Close Edit" : "Edit Detections"}
        </button>

        {dirty && (
          <button
            onClick={saveDetections}
            disabled={saving}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
          Loading...
        </div>
      )}
    </div>
  );
}
