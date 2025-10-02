import { useState } from 'react'

// These are linked via npm link - testing CSS conflicts
import { QuestionnaireRenderer } from '@mieweb/forms-renderer'
import { QuestionnaireEditor } from '@mieweb/forms-editor'
import { TextInput_Field, Check_Field, Radio_Field } from '@mieweb/forms-engine'

function App() {
  const [count, setCount] = useState(0)

  const sampleForm = {
    draftId: "test-form",
    title: "Test Form",
    sections: [
      {
        id: "section1",
        title: "Basic Fields",
        fields: [
          {
            id: "text1",
            type: "text",
            label: "Text Input Test",
            required: true
          },
          {
            id: "radio1",
            type: "radio",
            label: "Radio Test",
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" }
            ]
          },
          {
            id: "check1",
            type: "checkbox",
            label: "Checkbox Test",
            options: [
              { value: "check1", label: "Check 1" },
              { value: "check2", label: "Check 2" }
            ]
          }
        ]
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-red-600">
          Package CSS Conflict Test App
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">
            App Styles Test (should be RED text and BLUE background due to our conflicting CSS)
          </h2>
          <p className="text-xl bg-white p-4 border">
            This text should be RED and background should be BLUE due to our conflicting styles in index.css
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Counter Test</h2>
          <button 
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Count: {count}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Package Components Test</h2>
          <p className="text-gray-600 mb-4">
            Testing linked packages - CSS should work without conflicts!
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Forms Engine Components:</h3>
              <TextInput_Field 
                field={{ id: "test", label: "Test Input", type: "text" }}
                value=""
                onChange={() => {}}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Forms Renderer:</h3>
              <QuestionnaireRenderer questionnaire={sampleForm} />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Forms Editor:</h3>
              <QuestionnaireEditor questionnaire={sampleForm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App