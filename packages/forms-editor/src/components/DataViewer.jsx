import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import yaml from "js-yaml";

export default function DataViewer({
  open,
  onClose,
  data,
  title = "Data Viewer",
  placement = "center",       // "center" | "bottom"
  pretty = 2,
  defaultMode = "yaml",       // "json" | "yaml"
  fileBaseName = "form-data",
  contentClassName = "",
}) {
  const isCenter = placement === "center";
  const [mode, setMode] = React.useState(defaultMode === "yaml" ? "yaml" : "json");

  const viewerText = React.useMemo(() => {
    const indent = Math.max(2, pretty | 0);
    try {
      return mode === "yaml"
        ? yaml.dump(data ?? {}, { indent, lineWidth: 80, noRefs: true, forceQuotes: true, skipInvalid: true })
        : JSON.stringify(data ?? {}, null, indent);
    } catch {
      return mode === "yaml" ? "# Failed to render YAML" : String(data);
    }
  }, [data, mode, pretty]);

  const stop = (e) => e.stopPropagation();

  const download = (e) => {
    stop(e);
    const isYaml = mode === "yaml";
    const blob = new Blob([viewerText], { type: isYaml ? "text/yaml" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBaseName}.${isYaml ? "yml" : "json"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async (e) => {
    stop(e);
    try { await navigator.clipboard.writeText(viewerText); } catch { }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div className="w-full h-full flex items-end sm:items-center justify-center sm:max-w-4xl">
            <motion.div
              onMouseDown={stop}
              initial={{ y: isCenter ? 20 : "100%", opacity: isCenter ? 0 : 1, scale: isCenter ? 0.98 : 1 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: isCenter ? 20 : "100%", opacity: isCenter ? 0 : 1, scale: isCenter ? 0.98 : 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
              className={
                isCenter
                  ? "w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl bg-white shadow-lg border border-black/10 max-h-[80vh] overflow-hidden"
                  : "w-full mx-auto bg-black/5 border border-black/15 px-6 py-4 rounded-2xl backdrop-blur-xl overflow-hidden"
              }
            >
              <div className={`flex items-center justify-between ${isCenter ? "px-4 py-3 border-b border-black/10" : ""}`}>
                <h3 className="font-semibold">
                  {title} ({mode.toUpperCase()})
                </h3>
                <div className="flex items-center gap-2">
                  {/* Toggle */}
                                <div className="inline-flex rounded-lg border border-black/10 overflow-hidden">
                    <button
                      className={`px-3 py-1 text-sm ${mode === "yaml" ? "bg-black/6" : "bg-gray-200 hover:bg-black/5"}`}
                      aria-pressed={mode === "yaml"}
                      onClick={(e) => { stop(e); setMode("yaml"); }}
                    >
                      YAML
                    </button>
                    <button
                      className={`px-3 py-1 text-sm ${mode === "json" ? "bg-black/6" : "bg-gray-200 hover:bg-black/5"}`}
                      aria-pressed={mode === "json"}
                      onClick={(e) => { stop(e); setMode("json"); }}
                    >
                      JSON
                    </button>
                  </div>

                  <button className="px-3 py-1 rounded-lg border border-black/10 hover:bg-black/5 text-sm" onClick={copy}>
                    Copy
                  </button>
                  <button className="px-3 py-1 rounded-lg border border-black/10 hover:bg-black/5 text-sm" onClick={download}>
                    Download
                  </button>
                  <button
                    className="px-3 py-1 rounded-lg border border-black/10 hover:bg-black/5 text-sm"
                    onClick={(e) => { stop(e); onClose?.(); }}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className={
                isCenter
                  ? `p-4 overflow-auto max-h-[70vh] ${contentClassName}`
                  : `mt-2 p-2 rounded-lg overflow-y-auto max-h-96 ${contentClassName}`
              }>
                <pre className="whitespace-pre-wrap break-words text-sm text-gray-700">{viewerText}</pre>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
