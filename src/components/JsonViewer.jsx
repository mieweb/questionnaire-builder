import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function JsonViewer({
  open,
  onClose,
  data,
  title = "Form Data (JSON)",
  placement = "center", // "center" | "bottom"
  pretty = 2,
  contentClassName = "", // Css styling
}) {
  const jsonText = JSON.stringify(data ?? {}, null, pretty);
  const isCenter = placement === "center";

  const download = () => {
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
    } catch {}
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
              onMouseDown={(e) => e.stopPropagation()}
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
              {/* Header */}
              <div className={`flex items-center justify-between ${isCenter ? "px-4 py-3 border-b border-black/10" : ""}`}>
                <h3 className="font-semibold">{title}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copy}
                    className="px-3 py-1 rounded-lg border border-black/10 hover:bg-black/5 text-sm"
                  >
                    Copy
                  </button>
                  <button
                    onClick={download}
                    className="px-3 py-1 rounded-lg border border-black/10 hover:bg-black/5 text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={onClose}
                    className="px-3 py-1 rounded-lg border border-black/10 hover:bg-black/5 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Content */}
              <div
                className={
                  isCenter
                    ? `p-4 overflow-auto max-h-[70vh] ${contentClassName}`
                    : `mt-2 p-2 rounded-lg overflow-y-auto max-h-96 ${contentClassName}`
                }
              >
                <pre className="whitespace-pre-wrap break-words text-sm text-gray-700">
                  {jsonText}
                </pre>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
