import React from "react";
import { useFormStore, useFormData, useUIApi, adaptSchema, parseAndDetect, CODE_ICON, VEDITOR_ICON, PICTURE_ICON, UPLOAD_ICON, DOWNLOAD_ICON } from "@mieweb/forms-engine";

export default function Header() {
  const [showSchemaConfirm, setShowSchemaConfirm] = React.useState(false);
  const [pendingImport, setPendingImport] = React.useState(null);
  const replaceAll = useFormStore((s) => s.replaceAll);
  const formData = useFormData(); // Get complete form data with metadata

  const ui = useUIApi();
  const isPreview = ui.state.isPreview;
  const isCodeEditor = ui.state.isCodeEditor ?? false;

  // ────────── Import handler with auto-detection ──────────
  const handleFileSelect = (fileContent) => {
    try {
      const text = String(fileContent).replace(/^\uFEFF/, "").trim();
      const { data, schemaType } = parseAndDetect(text);

      if (schemaType !== 'mieforms' && schemaType !== 'surveyjs') {
        alert(`Unsupported or invalid schema format.\n\nExpected: MIE Forms or SurveyJS\nDetected: ${schemaType}`);
        return;
      }

      setPendingImport({ data, detectedSchemaType: schemaType });
      setShowSchemaConfirm(true);
    } catch (err) {
      alert(`Failed to parse file:\n\n${err?.message || "Invalid file format"}`);
    }
  };

  const confirmImport = (confirmedSchemaType) => {
    if (!pendingImport) return;

    try {
      const { data } = pendingImport;
      const result = adaptSchema(data, confirmedSchemaType);
      const fields = result.fields || [];

      if (!Array.isArray(fields)) {
        throw new Error("Expected array of fields");
      }

      if (result.conversionReport) {
        ui.setConversionReport(result.conversionReport);
      }

      const schemaObject = {
        schemaType: confirmedSchemaType === 'surveyjs' ? 'mieforms-v1.0' : (data.schemaType || 'mieforms-v1.0'),
        fields
      };

      // Preserve original metadata for SurveyJS schemas
      if (confirmedSchemaType === 'surveyjs' && result.conversionReport?.surveyMetadata) {
        Object.assign(schemaObject, result.conversionReport.surveyMetadata);
      } else if (confirmedSchemaType === 'mieforms') {
        // For MIE Forms, preserve any metadata that's not fields or schemaType
        const { fields: _f, schemaType: _st, ...metadata } = data;
        if (Object.keys(metadata).length > 0) {
          Object.assign(schemaObject, metadata);
        }
      }

      replaceAll(schemaObject);
      ui.selectedFieldId.clear();
      ui.preview.set(false);

      alert(`✅ Import successful!\n\nFormat: ${confirmedSchemaType === 'surveyjs' ? 'SurveyJS' : 'MIE Forms'}\nLoaded ${fields.length} field(s)`);

      setShowSchemaConfirm(false);
      setPendingImport(null);
    } catch (err) {
      alert(`Import failed:\n\n${err?.message || "Invalid format"}`);
      setShowSchemaConfirm(false);
      setPendingImport(null);
    }
  };

  const cancelImport = () => {
    setShowSchemaConfirm(false);
    setPendingImport(null);
  };

  // ────────── Preview/Edit toggles ──────────
  const onEdit = () => {
    ui.preview.set(false);
    ui.codeEditor.set(false);
  };

  const onCodeEditor = () => {
    ui.preview.set(false);
    ui.codeEditor.set(true);
  };

  const onPreview = () => {
    ui.preview.set(true);
    ui.codeEditor.set(false);
    ui.selectedFieldId.clear();
  };

  const onExport = () => {
    const json = JSON.stringify(formData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questionnaire.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="editor-header w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-4">
        {/* Top row: Logo/Title */}
        <div className="mb-4">
          <h1 className="text-lg lg:text-2xl font-bold text-slate-900">Editor</h1>
        </div>

        {/* Bottom row: View Mode Tabs + Import/Export */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="header-mode-toggle flex gap-1 rounded-lg border border-black/10 bg-black/5 p-1 w-fit">
            <button
              className={`flex items-center justify-center lg:gap-2 px-2 lg:px-4 py-2 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors ${!isPreview && !isCodeEditor
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                }`}
              onClick={onEdit}
              title="Visual Editor"
            >
              <VEDITOR_ICON className="w-5 h-5" />
              <span className="lg:inline">Visual Editor</span>
            </button>
            <button
              className={`flex items-center justify-center lg:gap-2 px-2 lg:px-4 py-2 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors ${isCodeEditor
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                }`}
              onClick={onCodeEditor}
              title="Code Editor"
            >
              <CODE_ICON className="w-5 h-5" />
              <span className="lg:inline">Code Editor</span>
            </button>
            <button
              className={`flex items-center justify-center lg:gap-2 px-2 lg:px-4 py-2 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors ${isPreview
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                }`}
              onClick={onPreview}
              title="Preview"
            >
              <PICTURE_ICON className="w-5 h-5" />
              <span className="lg:inline">Preview</span>
            </button>
          </div>

          <div className="header-actions flex gap-2 items-center">
            <label className="header-import-label px-3 lg:px-3 py-2 lg:py-2 rounded-lg border border-black/15 bg-white hover:bg-black/5 cursor-pointer text-xs lg:text-sm font-medium transition-colors flex items-center gap-2">
              <UPLOAD_ICON className="w-4 h-4" />
              Import
              <input
                className="hidden"
                type="file"
                accept=".json,.yaml,.yml,application/json,text/yaml"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => handleFileSelect(ev.target?.result ?? "");
                  reader.readAsText(file);
                  e.target.value = "";
                }}
              />
            </label>

            <button
              className="px-3 lg:px-3 py-2 lg:py-2 rounded-lg border border-black/15 bg-white hover:bg-black/5 text-xs lg:text-sm font-medium transition-colors flex items-center gap-2"
              onClick={onExport}
            >
              <DOWNLOAD_ICON className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Schema Type Confirmation Modal */}
      {showSchemaConfirm && pendingImport && (
        <div className="import-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="import-modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="import-modal-header mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Confirm Schema Type
              </h3>
              <p className="text-sm text-slate-600">
                Is this a <strong className="text-slate-900">{pendingImport.detectedSchemaType === 'surveyjs' ? 'SurveyJS' : 'MIE Forms'}</strong> schema?
              </p>
              {pendingImport.detectedSchemaType === 'surveyjs' && (
                <p className="text-xs text-slate-500 mt-2">
                  SurveyJS schemas will be converted to MIE Forms format.
                </p>
              )}
            </div>

            <div className="import-modal-actions flex gap-3">
              <button
                onClick={() => confirmImport(pendingImport.detectedSchemaType)}
                className="flex-1 px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors shadow-sm hover:shadow"
              >
                Yes, Import
              </button>

              <button
                onClick={cancelImport}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
