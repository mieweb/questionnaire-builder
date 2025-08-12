import React, { useState } from "react"
import FormBuilder from "./components/FormBuilderMain"
import Header from "./components/Header"

const App = () => {
  const [formData, setFormData] = useState([])
  const [isPreview, setIsPreview] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 font-titillium">
      <Header
        formData={formData}
        setFormData={setFormData}
      />

      <FormBuilder
        formData={formData}
        setFormData={setFormData}
        isPreview={isPreview}
        setIsPreview={setIsPreview} />
    </div>
  )
}

export default App
