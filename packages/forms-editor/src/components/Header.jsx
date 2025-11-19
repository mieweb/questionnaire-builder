import React from "react";
import { useFormStore, useFormData, useUIApi, adaptSchema, parseAndDetect } from "@mieweb/forms-engine";
import DataViewer from "./DataViewer.jsx";

export default function Header() {
  const [showData, setShowData] = React.useState(false);
  const [showSchemaConfirm, setShowSchemaConfirm] = React.useState(false);
  const [pendingImport, setPendingImport] = React.useState(null);
  const replaceAll = useFormStore((s) => s.replaceAll);
  const formData = useFormData(); // Get complete form data with metadata

  const ui = useUIApi();
  const isPreview = ui.state.isPreview;

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
  const onPreview = () => {
    ui.preview.set(true);
    ui.selectedFieldId.clear();
  };
  
  const onEdit = () => {
    ui.preview.set(false);
  };

  return (
    <header className="editor-header sticky top-0 z-49 bg-transparent mx-auto">
      <div className="header-title py-6 text-center">
        <h1 className="text-3xl sm:text-4xl tracking-tight">Questionnaire Builder</h1>
        <p className="mt-1 text-sm text-black/60">
          Build dynamic questionnaires with JSON config and FHIR export
        </p>
      </div>

      <div className="header-controls max-w-7xl mx-auto px-4">
        <div className="header-mode-toggle grid grid-cols-2 rounded-xl border border-black/10 bg-white shadow-sm">
          <button
            className={`py-3 rounded-xl text-sm font-medium ${!isPreview ? "bg-black/10" : ""}`}
            onClick={onEdit}
          >
            Builder
          </button>
          <button
            className={`py-3 rounded-xl text-sm font-medium ${isPreview ? "bg-black/10" : ""}`}
            onClick={onPreview}
          >
            Preview
          </button>
        </div>

        <div className="header-actions mt-4 flex flex-wrap gap-2 items-center justify-end">
          <label className="header-import-label px-4 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 cursor-pointer text-sm">
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
        data={formData}
        title="Form Data"
        placement="bottom"
        contentClassName="custom-scrollbar"
      />

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
