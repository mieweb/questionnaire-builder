import React from "react";
import Editor from "@monaco-editor/react";
import { useFormStore, useFormDefinition, useUIApi, parseAndDetect, adaptSchema, MIE_FORMS_SCHEMA_TYPE, useAlert } from "@mieweb/forms-engine";
import YAML from "js-yaml";

export default function CodeEditor() {
  const definition = useFormDefinition();
  const replaceAll = useFormStore((s) => s.replaceAll);
  const ui = useUIApi();
  const { showAlert } = useAlert();
  const containerRef = React.useRef(null);
  const codeRef = React.useRef("");
  const editorRef = React.useRef(null);
  const hasUnsavedChanges = React.useRef(false);
  
  // Refs to hold stable references for the unmount cleanup (to avoid running cleanup on dep changes)
  const replaceAllRef = React.useRef(replaceAll);
  const uiRef = React.useRef(ui);
  const definitionRef = React.useRef(definition);
  
  const [format, setFormat] = React.useState("yaml"); // "json" or "yaml"
  const formatRef = React.useRef(format);
  const [isDark, setIsDark] = React.useState(false);
  
  // Detect dark mode from parent .qb-editor-root element
  React.useEffect(() => {
    const editorRoot = document.querySelector(".qb-editor-root");
    if (!editorRoot) return;
    
    const checkDarkMode = () => {
      setIsDark(editorRoot.classList.contains("dark"));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(editorRoot, { attributes: true, attributeFilter: ["class"] });
    
    return () => observer.disconnect();
  }, []);
  const [editorHeight, setEditorHeight] = React.useState(640);
  const [code, setCode] = React.useState(() => {
    try {
      return YAML.dump(definition, { indent: 2, lineWidth: -1 });
    } catch {
      return "";
    }
  });
  const [error, setError] = React.useState("");

  // Clear error state on mount if we have valid initial code
  React.useEffect(() => {
    ui.setCodeEditorHasError(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep refs updated for use in unmount cleanup (without triggering cleanup)
  React.useEffect(() => {
    replaceAllRef.current = replaceAll;
    uiRef.current = ui;
    definitionRef.current = definition;
    formatRef.current = format;
  });

  // Parse code based on format
  const parseCode = React.useCallback((codeText) => {
    if (format === "json") {
      return JSON.parse(codeText);
    } else {
      return YAML.load(codeText);
    }
  }, [format]);

  // Serialize data to code based on format
  const serializeData = React.useCallback((data) => {
    if (format === "json") {
      return JSON.stringify(data, null, 2);
    } else {
      return YAML.dump(data, { indent: 2, lineWidth: -1 });
    }
  }, [format]);

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

  // Update code when definition changes (syncing from visual editor)
  React.useEffect(() => {
    // Don't overwrite if user has unsaved pasted content
    if (hasUnsavedChanges.current) return;
    
    try {
      const newCode = serializeData(definition);
      setCode(newCode);
      codeRef.current = newCode;
      setError("");
      ui.setCodeEditorHasError(false);
    } catch (err) {
      setError(`Failed to serialize: ${err.message}`);
      ui.setCodeEditorHasError(true);
    }
  }, [definition, serializeData, ui]);

  const handleCodeChange = (value) => {
    setCode(value || "");
    codeRef.current = value || "";
    hasUnsavedChanges.current = true;
    
    // Live validation
    try {
      const parsed = parseCode(value || "{}");
      
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid form data: must be an object");
      }
      
      setError("");
      ui.setCodeEditorHasError(false);
    } catch (err) {
      const errorMsg = `Invalid ${format.toUpperCase()}: ${err.message}`;
      setError(errorMsg);
      ui.setCodeEditorHasError(true);
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // Listen for paste events
    editor.onDidPaste((e) => {
      const beforePaste = code;
      const fullText = editor.getModel().getValue();
      
      try {
        const parsed = parseCode(fullText);
        
        if (parsed && typeof parsed === "object") {
          const { schemaType } = parseAndDetect(parsed);
          
          if (schemaType === 'surveyjs') {
            showAlert(
              `This SurveyJS schema will be converted to MIE Forms format.\n\nDo you want to proceed with the conversion?`,
              {
                title: 'ℹ️ SurveyJS Schema Detected',
                confirmText: 'Yes, Convert',
                cancelText: 'No, Cancel Paste',
                onConfirm: () => {
                  const { fields, conversionReport } = adaptSchema(parsed, schemaType);
                  const finalSchema = {
                    schemaType: parsed.schemaType || MIE_FORMS_SCHEMA_TYPE,
                    ...(conversionReport?.surveyMetadata || {}),
                    fields
                  };
                  
                  replaceAll(finalSchema);
                  
                  const convertedCode = serializeData(finalSchema);
                  setCode(convertedCode);
                  codeRef.current = convertedCode;
                  editor.setValue(convertedCode);
                  setError("");
                  hasUnsavedChanges.current = false;
                  
                  if (conversionReport) {
                    ui.setConversionReport(conversionReport);
                    setTimeout(() => {
                      const unsupportedCount = conversionReport?.unsupportedFields?.length || 0;
                      showAlert(
                        `This schema has been converted to MIE Forms format.\n\n` +
                        `Converted: ${conversionReport?.convertedFields || 0} field(s)\n` +
                        `Unsupported: ${unsupportedCount} field(s)${unsupportedCount > 0 ? ' ⚠️' : ''}\n\n` +
                        `Please use MIE Forms schema inside of code editor for the best experience in the future.`,
                        { title: 'ℹ️ SurveyJS Schema Detected' }
                      );
                    }, 100);
                  }
                },
                onCancel: () => {
                  editor.setValue(beforePaste);
                  setCode(beforePaste);
                  codeRef.current = beforePaste;
                }
              }
            );
          }
        }
      } catch (err) {
        // Invalid JSON/YAML - ignore, validation will handle it
      }
    });
  };

  const handleFormatChange = (newFormat) => {
    try {
      const currentData = parseCode(code);
      const newCode = newFormat === "json"
        ? JSON.stringify(currentData, null, 2)
        : YAML.dump(currentData, { indent: 2, lineWidth: -1 });
      
      setCode(newCode);
      codeRef.current = newCode;
      setFormat(newFormat);
      setError("");
      ui.setCodeEditorHasError(false);
    } catch (err) {
      setError(`Cannot convert: ${err.message}`);
      ui.setCodeEditorHasError(true);
    }
  };

  // Auto-save ONLY when component unmounts (switching away from code editor)
  // Uses refs to avoid triggering cleanup on every dependency change
  React.useEffect(() => {
    return () => {
      const currentCode = codeRef.current?.trim();
      const currentFormat = formatRef.current;
      const currentDefinition = definitionRef.current;
      const replaceAllFn = replaceAllRef.current;
      const uiApi = uiRef.current;
      
      // Helper to parse based on current format
      const parseCurrentCode = (text) => {
        if (currentFormat === "json") {
          return JSON.parse(text);
        } else {
          return YAML.load(text);
        }
      };
      
      if (!currentCode) {
        replaceAllFn({ schemaType: MIE_FORMS_SCHEMA_TYPE, fields: [] });
        hasUnsavedChanges.current = false;
        return;
      }

      try {
        const parsed = parseCurrentCode(currentCode);

        if (!parsed || typeof parsed !== "object") return;

        // Compare with current definition - only save if different
        if (JSON.stringify(currentDefinition) === JSON.stringify(parsed)) return;

        const { schemaType } = parseAndDetect(parsed);
        const { fields, conversionReport } = adaptSchema(parsed, schemaType);

        const finalSchema = {
          schemaType: parsed.schemaType || MIE_FORMS_SCHEMA_TYPE,
          ...(conversionReport?.surveyMetadata || {}),
          fields
        };

        if (conversionReport) {
          uiApi.setConversionReport(conversionReport);
        }

        replaceAllFn(finalSchema);
        uiApi.setCodeEditorHasError(false);
        hasUnsavedChanges.current = false;
      } catch (err) {
        // Silently fail - error already shown in editor header
      }
    };
  }, []); // Empty deps = only runs on mount/unmount

  return (
    <div ref={containerRef} className="code-editor-container mie:flex mie:flex-col mie:bg-miebackground mie:max-w-7xl mie:w-full" style={{ height: `${editorHeight}px` }}>
      {/* Header with format toggle and save button */}
      <div className="code-editor-header mie:flex mie:items-center mie:justify-between mie:gap-3 mie:p-4 mie:bg-miesurface mie:border-b mie:border-mieborder">
        <div className="mie:flex mie:items-center mie:gap-2">
          <div className="mie:flex mie:gap-1 mie:rounded-lg mie:border mie:border-mieborder mie:bg-miebackground mie:p-1">
            <button
              onClick={() => handleFormatChange("yaml")}
              className={`mie:px-3 mie:py-1 mie:rounded-md mie:text-sm mie:font-medium mie:transition-colors mie:border-0 mie:outline-none mie:focus:outline-none ${
                format === "yaml"
                  ? "mie:bg-mieprimary mie:text-mietextsecondary mie:shadow-sm"
                  : "mie:bg-transparent mie:text-mietextmuted mie:hover:text-mietext mie:hover:bg-miesurface"
              }`}
            >
              YAML
            </button>
            <button
              onClick={() => handleFormatChange("json")}
              className={`mie:px-3 mie:py-1 mie:rounded-md mie:text-sm mie:font-medium mie:transition-colors mie:border-0 mie:outline-none mie:focus:outline-none ${
                format === "json"
                  ? "mie:bg-mieprimary mie:text-mietextsecondary mie:shadow-sm"
                  : "mie:bg-transparent mie:text-mietextmuted mie:hover:text-mietext mie:hover:bg-miesurface"
              }`}
            >
              JSON
            </button>
          </div>
        </div>

        <div className="mie:flex mie:items-center mie:gap-2">
          <div className="mie:text-xs mie:text-mietextmuted mie:px-3 mie:py-1">
            Auto-saves when switching tabs
          </div>
          {error && (
            <div className="mie:text-xs mie:text-miedanger mie:bg-miedanger/10 mie:px-3 mie:py-1 mie:rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="code-editor-content mie:flex-1 mie:overflow-hidden">
        <Editor
          height="100%"
          language={format}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme={isDark ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 1.5,
            wordWrap: "on",
            formatOnPaste: false,
            formatOnType: false,
            tabSize: 2,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            contextmenu: true,
            accessibilitySupport: "auto",
            ariaLabel: "Code editor for form schema",
          }}
        />
      </div>
    </div>
  );
}
