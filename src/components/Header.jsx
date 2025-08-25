import React, { useRef, useEffect, useState } from "react"
const Header = ({ formData, setFormData, isPreview, setIsPreview, setSelectedFieldId}) => {

  const [showJson, setShowJson] = useState(false)
  const drawerRef = useRef(null)

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
    setIsPreview(true)
    setSelectedFieldId(null)
  }

  useEffect(() => {
    if (!showJson) return
    const onDown = (e) => {
      const el = drawerRef.current
      if (el && !el.contains(e.target)) setShowJson(false)
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [showJson])

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
            onClick={() => setIsPreview(false)}
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

      {/* JSON drawer*/}
      {showJson && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20">
          <div
            ref={drawerRef}
            className="w-full sm:max-w-3xl sm:rounded-2xl rounded-t-2xl bg-white shadow-lg border border-black/10 max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
              <h3 className="font-semibold">Form Data (JSON)</h3>
              <button
                className="px-3 py-1 rounded-lg border border-black/10 hover:bg-black/5 text-sm"
                onClick={() => setShowJson(false)}
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              <pre className="whitespace-pre-wrap break-words text-sm text-gray-700">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
