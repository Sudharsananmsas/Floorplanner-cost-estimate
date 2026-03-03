import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import type { TakeOffLeftPanelProps as Props } from "../types/TakeoffPanel.types";

export default function TakeoffLeftPanel({
  rows = [],
  detections = [],
  onBack,
}: Props) {
  const countMap: Record<string, number> = {};
  detections.forEach((det) => {
    countMap[det.class_name] = (countMap[det.class_name] || 0) + 1;
  });

  const summaryRows = Object.entries(countMap).map(([label, qty]) => ({
    label,
    qty,
    rows,
  }));

  // Excel export
  const exportExcel = () => {
    if (!summaryRows.length) return;
    const ws = XLSX.utils.json_to_sheet(summaryRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Counts");
    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([buf]), "takeoff.xlsx");
  };

  return (
    <div className=" w-100 bg-linear-to-b from-indigo-500 to-blue-300 text-white px-6 py-6 shadow-lg flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Takeoff</h1>

      <button
        onClick={onBack}
        className="mb-4 py-2 bg-blue-900 text-white rounded shadow hover:bg-blue-950"
      >
        ← Back to Plans
      </button>

      <h2 className="text-lg font-semibold mb-3">Legend Count</h2>

      <div className="bg-white text-black rounded shadow overflow-auto h-[55vh] p-2">
        <table className="w-full border rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left border-b">Label</th>
              <th className="p-2 text-left border-b">Qty</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              summaryRows.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border-b p-2">{r.label}</td>
                  <td className="border-b p-2">{r.qty}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={exportExcel}
        disabled={!summaryRows.length}
        className="mt-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 disabled:opacity-50"
      >
        Download Excel
      </button>
    </div>
  );
}
