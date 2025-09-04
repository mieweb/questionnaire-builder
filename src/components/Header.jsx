import React, { useState } from "react"
import JsonViewer from "./JsonViewer"

const Header = ({
  formData,
  setFormData,
  isPreview,
  setIsPreview,
  setSelectedFieldId,
  clearAllSectionHighlights,
}) => {

  const [showJson, setShowJson] = useState(false)

  const importData = (data) => {
    try {
      const parsedData = JSON.parse(data)
      setFormData(parsedData)
    } catch {
      alert("Invalid JSON format")
    }
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "form-data.json"
    a.click()
  }
  const onPreview = () => {
    setIsPreview(true);
    setSelectedFieldId(null);
    clearAllSectionHighlights?.(); 
  };

  const onEdit = () => {
    setIsPreview(false);
    clearAllSectionHighlights?.();
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent mx-auto">
      {/* Title */}
      <div className="py-6 text-center">
        <h1 className="text-3xl sm:text-4xl tracking-tight">Questionnaire Builder</h1>
        <p className="mt-1 text-sm text-black/60">Build dynamic questionnaires with JSON config and FHIR export</p>
      </div>

      {/* Builder / Preview switch */}
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

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2 items-center justify-end">
          <label className="px-4 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 cursor-pointer text-sm">
            Import
            <input
              className="hidden"
              type="file"
              accept="application/json"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = (ev) => importData(ev.target.result)
                reader.readAsText(file)
              }}
            />
          </label>

          <button
            className="px-4 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 text-sm"
            onClick={exportData}
          >
            Export
          </button>

          {/* Preview JSON */}
          <button
            className="px-4 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 text-sm"
            onClick={() => setShowJson(true)}
          >
            Preview JSON
          </button>
        </div>
      </div>

      <JsonViewer
        open={showJson}
        onClose={() => setShowJson(false)}
        data={formData}
        title="Form Data (JSON)"
        placement="bottom"
        contentClassName="custom-scrollbar"
      />
    </header>
  )
}

export default Header
