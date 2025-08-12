import React, { useState } from "react"
import FormBuilderMain from "./components/FormBuilderMain"
import Header from "./components/Header"
import MobileToolBar from "./components/MobileToolBar"
import fieldTypes from "./components/fields/fieldTypes-config"
import { addField, deleteField, updateField } from "./utils/formActions"

const App = () => {
  const [formData, setFormData] = useState([])
  const [isPreview, setIsPreview] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 font-titillium">
      <Header
        formData={formData}
        setFormData={setFormData}
      />

      <MobileToolBar
        fieldTypes={fieldTypes}
        formData={formData}
        setFormData={setFormData}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        addField={addField}
      />

      <FormBuilderMain
        formData={formData}
        setFormData={setFormData}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        updateField={(id, key, value) =>
          updateField(formData, setFormData, id, key, value)
        }
        deleteField={(id) => 
          deleteField(formData, setFormData, id)}
      />
    </div>

  )
}

export default App
