import React, { useState } from "react";
import DataViewer from "./DataViewer.jsx";

export default function Header({ hooks }) {
  const [showData, setShowData] = useState(false);
  const replaceAll = hooks.useFormStore((s) => s.replaceAll);
  const fieldsArray = hooks.useFieldsArray();

  const ui = hooks.useUIApi();
  const isPreview = ui.state.isPreview;

  // ────────── Import handler ──────────
  const importData = (data) => {
    try {
      const text = String(data).replace(/^\uFEFF/, "").trim();
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : parsed?.fields;
      if (!Array.isArray(arr)) throw new Error("Expected [] or { fields: [] }");
      replaceAll(arr);
      ui.selectedFieldId.clear();
      ui.preview.set(false);
    } catch (err) {
      alert(err?.message || "Invalid JSON format");
    }
  };

  // ────────── Preview/Edit toggles ──────────
  const onPreview = () => {
    ui.preview.set(true);
    ui.selectedFieldId.clear();
  };
  const onEdit = () => ui.preview.set(false);

  return (
    <header className="sticky top-0 z-49 bg-transparent mx-auto">
      <div className="py-6 text-center">
        <h1 className="text-3xl sm:text-4xl tracking-tight">Questionnaire Builder</h1>
        <p className="mt-1 text-sm text-black/60">
          Build dynamic questionnaires with JSON config and FHIR export
        </p>
      </div>

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

        <div className="mt-4 flex flex-wrap gap-2 items-center justify-end">
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
                reader.readAsText(file);
                e.target.value = "";
              }}
            />
          </label>

          <button
            className="px-4 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 text-sm"
            onClick={() => setShowData(true)}
          >
            Data Viewer
          </button>
        </div>
      </div>

      <DataViewer
        open={showData}
        onClose={() => setShowData(false)}
        data={fieldsArray}
        title="Form Data"
        placement="bottom"
        contentClassName="custom-scrollbar"
      />
    </header>
  );
}