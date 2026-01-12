import React from "react";
import { useFormStore, useFormData, useUIApi, adaptSchema, parseAndDetect, useAlert, CODE_ICON, VEDITOR_ICON, PICTURE_ICON, UPLOAD_ICON, DOWNLOAD_ICON } from "@mieweb/forms-engine";

export default function Header() {
  const [showSchemaConfirm, setShowSchemaConfirm] = React.useState(false);
  const [pendingImport, setPendingImport] = React.useState(null);
  const replaceAll = useFormStore((s) => s.replaceAll);
  const formData = useFormData(); // Get complete form data with metadata
  const { showAlert } = useAlert();

  const ui = useUIApi();
  const isPreview = ui.state.isPreview;
  const isCodeEditor = ui.state.isCodeEditor ?? false;
  const codeEditorHasError = ui.state.codeEditorHasError ?? false;

  // ────────── Import handler with auto-detection ──────────
  const handleFileSelect = (fileContent) => {
    try {
      const text = String(fileContent).replace(/^\uFEFF/, "").trim();
      const { data, schemaType } = parseAndDetect(text);

      if (schemaType !== 'mieforms' && schemaType !== 'surveyjs') {
        showAlert(
          `Expected: MIE Forms or SurveyJS\nDetected: ${schemaType}`,
          { title: 'Unsupported Schema Format' }
        );
        return;
      }

      setPendingImport({ data, detectedSchemaType: schemaType });
      setShowSchemaConfirm(true);
    } catch (err) {
      showAlert(
        err?.message || "Invalid file format",
        { title: 'Failed to Parse File' }
      );
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
        ...(result.conversionReport?.surveyMetadata || {}),
        fields
      };

      // For MIE Forms schemas, preserve any extra metadata that's not in surveyMetadata
      if (confirmedSchemaType === 'mieforms') {
        // For MIE Forms, preserve any metadata that's not fields or schemaType
        const { fields: _f, schemaType: _st, ...metadata } = data;
        if (Object.keys(metadata).length > 0) {
          Object.assign(schemaObject, metadata);
        }
      }

      replaceAll(schemaObject);
      ui.selectedFieldId.clear();
      ui.preview.set(false);

      // Show conversion details for SurveyJS imports
      if (confirmedSchemaType === 'surveyjs' && result.conversionReport) {
        const report = result.conversionReport;
        const unsupportedCount = report.unsupportedFields?.length || 0;
        showAlert(
          `Format: SurveyJS → MIE Forms\n\n` +
          `Converted: ${report.convertedFields || 0} field(s)\n` +
          `Unsupported: ${unsupportedCount} field(s)${unsupportedCount > 0 ? ' ⚠️' : ''}`,
          { title: '✅ Import Successful' }
        );
      } else {
        showAlert(
          `Format: ${confirmedSchemaType === 'surveyjs' ? 'SurveyJS' : 'MIE Forms'}\nLoaded ${fields.length} field(s)`,
          { title: '✅ Import Successful' }
        );
      }

      setShowSchemaConfirm(false);
      setPendingImport(null);
    } catch (err) {
      showAlert(
        err?.message || "Invalid format",
        { title: 'Import Failed' }
      );
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
    <header className="editor-header mie:w-full mie:bg-white mie:border mie:border-gray-200 mie:rounded-lg mie:shadow-sm">
      <div className="mie:px-4 mie:py-4">
        {/* Top row: Logo/Title */}
        <div className="mie:mb-4">
          <h1 className="mie:text-lg mie:lg:text-2xl mie:font-bold mie:text-slate-900">Editor</h1>
        </div>

        {/* Bottom row: View Mode Tabs + Import/Export */}
        <div className="mie:flex mie:flex-wrap mie:items-center mie:justify-between mie:gap-3">
          <div className="header-mode-toggle mie:flex mie:gap-1 mie:rounded-lg mie:border mie:border-black/10 mie:bg-black/5 mie:p-1 mie:w-fit">
            <button
              className={`mie:flex mie:items-center mie:justify-center mie:gap-2 mie:px-2 mie:lg:px-4 mie:py-2 mie:lg:py-2 mie:rounded-lg mie:text-xs mie:lg:text-sm mie:font-medium mie:transition-colors ${
                !isPreview && !isCodeEditor
                  ? "mie:bg-white mie:text-slate-900 mie:shadow-sm"
                  : codeEditorHasError
                  ? "mie:text-slate-400 mie:cursor-not-allowed"
                  : "mie:text-slate-600 mie:hover:text-slate-900"
              }`}
              onClick={onEdit}
              disabled={codeEditorHasError}
              title={codeEditorHasError ? "Fix code errors before switching" : "Visual Editor"}
            >
              <VEDITOR_ICON className="mie:w-5 mie:h-5" />
              <span>Build</span>
            </button>
            <button
              className={`mie:flex mie:items-center mie:justify-center mie:gap-2 mie:px-2 mie:lg:px-4 mie:py-2 mie:lg:py-2 mie:rounded-lg mie:text-xs mie:lg:text-sm mie:font-medium mie:transition-colors ${isCodeEditor
                  ? "mie:bg-white mie:text-slate-900 mie:shadow-sm"
                  : "mie:text-slate-600 mie:hover:text-slate-900"
                }`}
              onClick={onCodeEditor}
              title="Code Editor"
            >
              <CODE_ICON className="mie:w-5 mie:h-5" />
              <span>Code</span>
            </button>
            <button
              className={`mie:flex mie:items-center mie:justify-center mie:gap-2 mie:px-2 mie:lg:px-4 mie:py-2 mie:lg:py-2 mie:rounded-lg mie:text-xs mie:lg:text-sm mie:font-medium mie:transition-colors ${
                isPreview
                  ? "mie:bg-white mie:text-slate-900 mie:shadow-sm"
                  : codeEditorHasError
                  ? "mie:text-slate-400 mie:cursor-not-allowed"
                  : "mie:text-slate-600 mie:hover:text-slate-900"
              }`}
              onClick={onPreview}
              disabled={codeEditorHasError}
              title={codeEditorHasError ? "Fix code errors before switching" : "Preview Form"}
            >
              <PICTURE_ICON className="mie:w-5 mie:h-5" />
              <span>Preview</span>
            </button>
          </div>

          <div className="header-actions mie:flex mie:gap-1 mie:items-center">
            <label className="header-import-label mie:px-2 mie:py-2 mie:lg:px-3 mie:lg:py-2 mie:rounded-lg mie:border mie:border-black/15 mie:bg-white mie:hover:bg-black/5 mie:cursor-pointer mie:text-xs mie:lg:text-sm mie:font-medium mie:transition-colors mie:flex mie:items-center mie:lg:gap-2 mie:gap-0">
              <UPLOAD_ICON className="mie:w-4 mie:h-4 mie:lg:w-4 mie:lg:h-4" />
              <span className="mie:hidden min-[445px]:inline">Import</span>
              <input
                className="mie:hidden"
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
              className="mie:px-2 mie:py-2 mie:lg:px-3 mie:lg:py-2 mie:rounded-lg mie:border mie:border-black/15 mie:bg-white mie:hover:bg-black/5 mie:text-xs mie:lg:text-sm mie:font-medium mie:transition-colors mie:flex mie:items-center mie:lg:gap-2 mie:gap-0"
              onClick={onExport}
              title="Export"
            >
              <DOWNLOAD_ICON className="mie:w-4 mie:h-4 mie:lg:w-4 mie:lg:h-4" />
              <span className="mie:hidden min-[445px]:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Schema Type Confirmation Modal */}
      {showSchemaConfirm && pendingImport && (
        <div className="import-modal-overlay mie:fixed mie:inset-0 mie:z-50 mie:flex mie:items-center mie:justify-center mie:bg-black/50 mie:p-4">
          <div className="import-modal-content mie:bg-white mie:rounded-2xl mie:shadow-2xl mie:max-w-md mie:w-full mie:p-6">
            <div className="import-modal-header mie:mb-6">
              <h3 className="mie:text-xl mie:font-semibold mie:text-slate-900 mie:mb-2">
                Confirm Schema Type
              </h3>
              <p className="mie:text-sm mie:text-slate-600">
                Is this a <strong className="mie:text-slate-900">{pendingImport.detectedSchemaType === 'surveyjs' ? 'SurveyJS' : 'MIE Forms'}</strong> schema?
              </p>
              {pendingImport.detectedSchemaType === 'surveyjs' && (
                <p className="mie:text-xs mie:text-slate-500 mie:mt-2">
                  SurveyJS schemas will be converted to MIE Forms format.
                </p>
              )}
            </div>

            <div className="import-modal-actions mie:flex mie:gap-3">
              <button
                onClick={() => confirmImport(pendingImport.detectedSchemaType)}
                className="mie:flex-1 mie:px-6 mie:py-3 mie:rounded-xl mie:bg-blue-500 mie:text-white mie:font-semibold mie:hover:bg-blue-600 mie:transition-colors mie:shadow-sm hover:shadow"
              >
                Yes, Import
              </button>

              <button
                onClick={cancelImport}
                className="mie:flex-1 mie:px-6 mie:py-3 mie:rounded-xl mie:border-2 mie:border-slate-300 mie:bg-white mie:hover:bg-slate-50 mie:text-slate-700 mie:font-semibold mie:transition-colors"
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
