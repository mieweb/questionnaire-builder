import React from "react";
import Editor from "@monaco-editor/react";
import { useFormStore, useFormData, useUIApi } from "@mieweb/forms-engine";
import YAML from "js-yaml";

export default function CodeEditor() {
  const formData = useFormData();
  const replaceAll = useFormStore((s) => s.replaceAll);
  const ui = useUIApi();
  const containerRef = React.useRef(null);
  
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
  };

  const handleSave = () => {
    try {
      let parsed;
      if (format === "json") {
        parsed = JSON.parse(code);
      } else {
        parsed = YAML.load(code);
      }

      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid form data: must be an object");
      }

      // Validate minimal structure
      if (!Array.isArray(parsed.fields)) {
        parsed.fields = parsed.fields || [];
      }

      replaceAll(parsed);
      setError("");
      ui.preview.set(false);
      ui.codeEditor.set(false);
    } catch (err) {
      setError(`Invalid ${format.toUpperCase()}: ${err.message}`);
    }
  };

  const handleFormatChange = (newFormat) => {
    try {
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
          <button
            onClick={handleSave}
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
