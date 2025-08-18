import React from "react"

const Header = ({ formData, setFormData }) => {
  const importData = (data) => {
    try {
      const parsedData = JSON.parse(data)
      setFormData(parsedData)
    } catch (error) {
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

  return (
    <div className="Header-Container sticky mx-auto z-100">
      <div className="flex flex-col min-[700px]:flex-row justify-between items-center bg-black/5 p-4 md:rounded-xl backdrop-blur-2xl shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Questionnaire Builder</h1>
        <div className="flex items-center justify-center max-[380px]:text-sm">

          {/*EXPORT BUTTON */}
          <button
            className="px-4 py-5 mx-1 bg-blue-500 text-white rounded cursor-pointer"
            onClick={exportData}
          >
            Export
          </button>

          {/*IMPORT BUTTON */}
          <label className="px-4 py-5 mx-1 bg-green-500 text-white rounded cursor-pointer"
          >
            Import
            <input
              className="hidden"
              type="file"
              accept="application/json"
              onChange={(e) => {
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.onload = (event) => importData(event.target.result)
                reader.readAsText(file)
              }}
            />
          </label>

        </div>
      </div>
    </div>
  )
}

export default Header
