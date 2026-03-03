import React from "react";

import type { LeftPanelProps } from "../types/Plans.types";

export default function LeftPanel({
  onFileSelect,
  onConvert,
  hasFile,
  isConverting,
  onClearFile,
}: LeftPanelProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileSelect(file);
  };

  return (
    <div className="w-100 bg-linear-to-b from-indigo-500 to-blue-300 text-white px-6 py-6 shadow-lg flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Plans</h1>

      <label className="block text-sm font-semibold mb-2">Upload PDF</label>
      <div className="relative mb-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full mb-3 text-sm rounded border border-white/40 bg-white text-gray-900 py-2 px-2 cursor-pointer shadow-sm pr-8"
        />

        {hasFile && (
          <button
            onClick={onClearFile}
            className="absolute right-1 top-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
          >
            <b>✕</b>
          </button>
        )}
      </div>

      <button
        onClick={onConvert}
        disabled={!hasFile || isConverting}
        className={`mt-2 w-full py-2 text-sm rounded shadow-md font-semibold ${
          !hasFile || isConverting
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-yellow-400 text-black hover:bg-yellow-500"
        }`}
      >
        {isConverting ? "Converting..." : "Convert to Image"}
      </button>

      <div className="mt-6 bg-white/20 rounded p-3 text-sm backdrop-blur-sm shadow">
        <div>Steps:</div>
        <div className="mt-1 opacity-90">
          1. Upload floor plan PDF <br />
          2. Click <strong>Convert to Image</strong> <br />
          3. Navigate pages and Predict
        </div>
      </div>
    </div>
  );
}
