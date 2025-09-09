import React, { useState } from "react";
import JsonViewer from "./JsonViewer";
import { useFormStore, useFieldsArray } from "../state/formStore";

export default function Header({ isPreview, setIsPreview, setSelectedFieldId }) {
  const [showJson, setShowJson] = useState(false);
  const replaceAll = useFormStore((s) => s.replaceAll);
  const fieldsArray = useFieldsArray();

  const importData = (data) => {
    try {
      const text = String(data).replace(/^\uFEFF/, "").trim();
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : parsed?.fields;
      if (!Array.isArray(arr)) throw new Error("Expected [] or { fields: [] }");
      replaceAll(arr);
      setSelectedFieldId?.(null);
      setIsPreview?.(false);
    } catch (err) {
      alert(err?.message || "Invalid JSON format");
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(fieldsArray, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "form-data.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const onPreview = () => { setIsPreview(true); setSelectedFieldId(null); };
  const onEdit = () => setIsPreview(false);

  return (
    <header className="sticky top-0 z-50 bg-transparent mx-auto">
      {/* Title */}
      <div className="py-6 text-center">
        <h1 className="text-3xl sm:text-4xl tracking-tight">Questionnaire Builder</h1>
        <p className="mt-1 text-sm text-black/60">
          Build dynamic questionnaires with JSON config and FHIR export
        </p>
      </div>

      {/* ────────── Edit/Preview Switch ──────────  */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 rounded-xl border border-black/10 bg-white shadow-sm">
          <button
            className={`py-3 rounded-xl text-sm font-medium ${!isPreview ? "bg-black/5" : ""}`}
            onClick={onEdit}
          >
            Builder
          </button>
          <button
            className={`py-3 rounded-xl text-sm font-medium ${isPreview ? "bg-black/5" : ""}`}
            onClick={onPreview}
          >
            Preview
          </button>
        </div>

        {/* ────────── Actions Import/Export/Preview ──────────  */}
        <div className="mt-4 flex flex-wrap gap-2 items-center justify-end">

          {/* ────────── Import Button ──────────  */}
          <label className="px-4 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 cursor-pointer text-sm">
            Import
            <input
              className="hidden"
              type="file"
              accept=".json,application/json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => importData(ev.target?.result ?? "");
                reader.readAsText(file);   // read as text
                e.target.value = "";       // allow re-importing same file
              }}
            />
          </label>
          
          {/* ────────── Export Button ──────────  */}
          <button
            className="px-4 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 text-sm"
            onClick={exportData}
          >
            Export
          </button>

          {/* ────────── JSON Preview ──────────  */}
          <button
            className="px-4 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 text-sm"
            onClick={() => setShowJson(true)}
          >
            Preview JSON
          </button>
        </div>
      </div>

      <JsonViewer
        open={showJson}
        onClose={() => setShowJson(false)}
        data={fieldsArray}             
        title="Form Data (JSON)"
        placement="bottom"
        contentClassName="custom-scrollbar"
      />
    </header>
  );
};
