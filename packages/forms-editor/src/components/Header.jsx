import { useState } from "react";
import { useFormStore, useFieldsArray, useUIApi, adaptSchema } from "@mieweb/forms-engine";
import DataViewer from "./DataViewer.jsx";

export default function Header() {
  const [showData, setShowData] = useState(false);
  const [showSchemaSelector, setShowSchemaSelector] = useState(false);
  const [pendingFileData, setPendingFileData] = useState(null);
  const replaceAll = useFormStore((s) => s.replaceAll);
  const fieldsArray = useFieldsArray();

  const ui = useUIApi();
  const isPreview = ui.state.isPreview;

  // ────────── Import handler ──────────
  const importData = (data, schemaType) => {
    try {
      const text = String(data).replace(/^\uFEFF/, "").trim();
      const parsed = JSON.parse(text);
      
      let fields;
      let conversionReport = null;
      
      if (schemaType === 'surveyjs') {
        // Convert SurveyJS schema
        const result = adaptSchema(parsed, 'surveyjs');
        fields = result.fields || result;
        conversionReport = result.conversionReport;
        
        // Store conversion report in UI store
        if (conversionReport) {
          ui.setConversionReport(conversionReport);
          
          // Log conversion summary
          console.log('[Editor] SurveyJS schema converted:', {
            totalElements: conversionReport.totalElements,
            convertedFields: conversionReport.convertedFields,
            droppedFields: conversionReport.droppedFields.length,
            warnings: conversionReport.warnings.length
          });
          
          // Show summary alert
          const summary = [
            `✅ Converted ${conversionReport.convertedFields} of ${conversionReport.totalElements} fields`,
            conversionReport.droppedFields.length > 0 ? `⚠️ Dropped ${conversionReport.droppedFields.length} unsupported fields` : null,
            conversionReport.warnings.length > 0 ? `⚠️ ${conversionReport.warnings.length} conversion warnings (check console)` : null
          ].filter(Boolean).join('\n');
          
          alert(`SurveyJS Import Complete:\n\n${summary}`);
          
          // Log warnings if any
          if (conversionReport.warnings.length > 0) {
            const highImpact = conversionReport.warnings.filter(w => w.impact === 'high');
            const mediumImpact = conversionReport.warnings.filter(w => w.impact === 'medium');
            
            if (highImpact.length > 0) {
              console.warn(`⚠️ HIGH IMPACT (${highImpact.length}):`, highImpact);
            }
            if (mediumImpact.length > 0) {
              console.warn(`⚠️ MEDIUM IMPACT (${mediumImpact.length}):`, mediumImpact);
            }
          }
          
          if (conversionReport.droppedFields.length > 0) {
            console.error('❌ DROPPED FIELDS:', conversionReport.droppedFields);
          }
        }
      } else {
        // Default inhouse format
        fields = Array.isArray(parsed) ? parsed : parsed?.fields;
      }
      
      if (!Array.isArray(fields)) {
        throw new Error("Expected array of fields or { fields: [] }");
      }
      
      replaceAll(fields);
      ui.selectedFieldId.clear();
      ui.preview.set(false);
    } catch (err) {
      alert(err?.message || "Invalid JSON format");
    }
  };
  
  // ────────── Handle file selection ──────────
  const handleFileSelect = (fileData) => {
    setPendingFileData(fileData);
    setShowSchemaSelector(true);
  };
  
  // ────────── Schema type selected ──────────
  const handleSchemaTypeSelect = (schemaType) => {
    if (pendingFileData) {
      importData(pendingFileData, schemaType);
    }
    setShowSchemaSelector(false);
    setPendingFileData(null);
  };
  
  const cancelImport = () => {
    setShowSchemaSelector(false);
    setPendingFileData(null);
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
        data={fieldsArray}
        title="Form Data"
        placement="bottom"
        contentClassName="custom-scrollbar"
      />
      
      {/* Schema Type Selector Modal */}
      {showSchemaSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Select Schema Type
              </h3>
              <p className="text-sm text-slate-600">
                Choose the format of the file you're importing
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSchemaTypeSelect('inhouse')}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 mb-1">Default Schema</div>
                    <div className="text-sm text-slate-600">
                      Our internal questionnaire format
                    </div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleSchemaTypeSelect('surveyjs')}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-purple-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 mb-1">SurveyJS Schema</div>
                    <div className="text-sm text-slate-600">
                      Will be converted to our internal format
                    </div>
                  </div>
                </div>
              </button>
            </div>
            
            <button
              onClick={cancelImport}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
