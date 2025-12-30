import React from "react";
import Editor from "@monaco-editor/react";
import { useFormStore, useFormData, useUIApi, parseAndDetect, adaptSchema, MIE_FORMS_SCHEMA_TYPE, useAlert } from "@mieweb/forms-engine";
import YAML from "js-yaml";

export default function CodeEditor() {
  const formData = useFormData();
  const replaceAll = useFormStore((s) => s.replaceAll);
  const ui = useUIApi();
  const { showAlert } = useAlert();
  const containerRef = React.useRef(null);
  const autoSaveTimeoutRef = React.useRef(null);
  
  const [format, setFormat] = React.useState("yaml"); // "json" or "yaml"
  const [editorHeight, setEditorHeight] = React.useState(640);
  const [code, setCode] = React.useState(() => {
    try {
      return YAML.dump(formData, { indent: 2, lineWidth: -1 });
    } catch {
      return "";
    }
  });
  const [error, setError] = React.useState("");

  // Calculate available height on mount and resize
  React.useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current) {
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const availableHeight = window.innerHeight - containerTop - 20; // 20px bottom margin
        setEditorHeight(Math.max(400, availableHeight)); // min 400px
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  // Update code when formData changes (syncing from visual editor)
  React.useEffect(() => {
    try {
      const newCode = format === "json"
        ? JSON.stringify(formData, null, 2)
        : YAML.dump(formData, { indent: 2, lineWidth: -1 });
      setCode(newCode);
      setError("");
    } catch (err) {
      setError(`Failed to serialize: ${err.message}`);
    }
  }, [formData, format]);

  const handleCodeChange = (value) => {
    setCode(value || "");
    setError("");
    
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save after 1.5 seconds of inactivity
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave(value || code);
    }, 1500);
  };

  const handleSave = (codeToSave = code) => {
    try {
      let parsed;
      if (format === "json") {
        parsed = JSON.parse(codeToSave);
      } else {
        parsed = YAML.load(codeToSave);
      }

      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid form data: must be an object");
      }

      // Detect schema type and adapt if necessary
      const { schemaType } = parseAndDetect(parsed);
      const { fields, conversionReport } = adaptSchema(parsed, schemaType);

      // Notify user if schema was converted from SurveyJS
      if (schemaType === 'surveyjs') {
        showAlert(
          `This schema will be converted to MIE Forms format.\n\n` +
          `Converted: ${conversionReport?.convertedFields || 0} field(s)\n` +
          `Dropped: ${conversionReport?.droppedFields?.length || 0} unsupported field(s)\n\n` +
          `Please use MIE Forms schema inside of code editor for the best experience in the future.`,
          { title: 'ℹ️ SurveyJS Schema Detected' }
        );
      }

      // Build final schema object
      const finalSchema = {
        schemaType: parsed.schemaType || MIE_FORMS_SCHEMA_TYPE,
        fields
      };

      // If converted from another format, store conversion report in UI
      if (conversionReport) {
        ui.setConversionReport(conversionReport);
      }

      replaceAll(finalSchema);
      setError("");
    } catch (err) {
      setError(`Invalid ${format.toUpperCase()}: ${err.message}`);
    }
  };

  const handleFormatChange = (newFormat) => {
    try {
      // Clear any pending auto-save
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      let newCode;
      const currentData = format === "json" ? JSON.parse(code) : YAML.load(code);
      
      if (newFormat === "json") {
        newCode = JSON.stringify(currentData, null, 2);
      } else {
        newCode = YAML.dump(currentData, { indent: 2, lineWidth: -1 });
      }
      
      setCode(newCode);
      setFormat(newFormat);
      setError("");
    } catch (err) {
      setError(`Cannot convert: ${err.message}`);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="code-editor-container flex flex-col bg-gray-50 max-w-7xl w-full" style={{ height: `${editorHeight}px` }}>
      {/* Header with format toggle and save button */}
      <div className="code-editor-header flex items-center justify-between gap-3 p-4 bg-white border-b border-black/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg border border-black/10 bg-black/5 p-1">
            <button
              onClick={() => handleFormatChange("yaml")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                format === "yaml"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              YAML
            </button>
            <button
              onClick={() => handleFormatChange("json")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                format === "json"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              JSON
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <div className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-lg">
              {error}
            </div>
          )}
          <div className="text-xs text-gray-500 px-3 py-1">
            Auto-saves after 1.5s
          </div>
          <button
            onClick={() => handleSave()}
            className="px-4 py-2 rounded-lg border border-black/15 bg-white hover:bg-black/5 text-sm font-medium transition-colors"
          >
            Apply Changes
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="code-editor-content flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={format}
          value={code}
          onChange={handleCodeChange}
          theme="light"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 1.5,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 16 },
          }}
        />
      </div>
    </div>
  );
}
