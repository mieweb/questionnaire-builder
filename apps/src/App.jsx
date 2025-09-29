import React, { useState, useEffect } from "react";
import { FormEditor } from "@questionnaire-builder/editor";
import { FormRenderer } from "@questionnaire-builder/forms";
import { useFormStore, useUIApi, useFormApi, useFieldsArray } from "@questionnaire-builder/editor";
import { isVisible } from "@questionnaire-builder/editor";

export default function App() {
  const [activeDemo, setActiveDemo] = useState('editor');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const hooks = {
    useFormStore,
    useUIApi,
    useFormApi,
    useFieldsArray
  };

  // Load sample form data when component mounts
  useEffect(() => {
    const sampleFormData = [
      // Demographics section
      {
        id: "demographics-section",
        fieldType: "section",
        title: "Demographics",
        fields: [
          { id: "age", fieldType: "input", question: "Age", answer: "", required: true },
          {
            id: "sex",
            fieldType: "selection",
            question: "Sex assigned at birth",
            selected: "",
            required: true,
            options: [
              { id: "male", value: "Male" },
              { id: "female", value: "Female" },
              { id: "other", value: "Other" }
            ]
          },
          {
            id: "pregnant",
            fieldType: "radio",
            question: "Are you currently pregnant?",
            selected: "",
            options: [ { id: "yes", value: "Yes" }, { id: "no", value: "No" } ],
            // Only relevant for people assigned female at birth
            enableWhen: { logic: "AND", conditions: [ { targetId: "sex", operator: "equals", value: "female" } ] }
          },
          { id: "due_date", fieldType: "input", question: "If pregnant, estimated due date (YYYY-MM-DD)", answer: "", enableWhen: { logic: "AND", conditions: [ { targetId: "pregnant", operator: "equals", value: "yes" } ] } }
        ]
      },

      // Screening section
      {
        id: "screening-section",
        fieldType: "section",
        title: "Symptom Screening",
        fields: [
          {
            id: "symptoms_present",
            fieldType: "radio",
            question: "Do you currently have any of the following symptoms?",
            selected: "",
            options: [ { id: "yes", value: "Yes" }, { id: "no", value: "No" } ],
            required: true
          },
          {
            id: "symptoms_list",
            fieldType: "selection",
            question: "Select symptoms",
            selected: "",
            options: [
              { id: "fever", value: "Fever" },
              { id: "cough", value: "Cough" },
              { id: "sore_throat", value: "Sore throat" },
              { id: "shortness_breath", value: "Shortness of breath" }
            ],
            // Only show symptom options when symptoms_present === yes
            enableWhen: { logic: "AND", conditions: [ { targetId: "symptoms_present", operator: "equals", value: "yes" } ] }
          },
          { id: "symptom_onset", fieldType: "input", question: "Symptom onset date", answer: "", enableWhen: { logic: "AND", conditions: [ { targetId: "symptoms_present", operator: "equals", value: "yes" } ] } }
        ]
      },

      // Exposure section
      {
        id: "exposure-section",
        fieldType: "section",
        title: "Exposure & Travel",
        fields: [
          { id: "recent_travel", fieldType: "radio", question: "Recent international travel in last 14 days?", selected: "", options: [ { id: "yes", value: "Yes" }, { id: "no", value: "No" } ] },
          { id: "travel_countries", fieldType: "input", question: "If yes, list countries visited", answer: "", enableWhen: { logic: "AND", conditions: [ { targetId: "recent_travel", operator: "equals", value: "yes" } ] } },
          { id: "contact_case", fieldType: "radio", question: "Close contact with a confirmed case?", selected: "", options: [ { id: "yes", value: "Yes" }, { id: "no", value: "No" } ] },
          { id: "contact_date", fieldType: "input", question: "If yes, date of last contact", answer: "", enableWhen: { logic: "AND", conditions: [ { targetId: "contact_case", operator: "equals", value: "yes" } ] } }
        ]
      },

      // Medical history section
      {
        id: "medical-history",
        fieldType: "section",
        title: "Medical History",
        fields: [
          { id: "chronic_conditions", fieldType: "radio", question: "Do you have any chronic conditions?", selected: "", options: [ { id: "yes", value: "Yes" }, { id: "no", value: "No" } ] },
          { id: "conditions_list", fieldType: "input", question: "If yes, please list", answer: "", enableWhen: { logic: "AND", conditions: [ { targetId: "chronic_conditions", operator: "equals", value: "yes" } ] } }
        ]
      },

      // Consent / submit
  { id: "consent", fieldType: "radio", question: "I consent to data collection for screening purposes", selected: "", options: [ { id: "agree", value: "I agree" }, { id: "decline", value: "I decline" } ], required: true }
    ];

    // Load sample data into the form store
    const replaceAll = hooks.useFormStore.getState().replaceAll;
    replaceAll(sampleFormData);
  }, [hooks]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen]);

  const enterFullscreen = (demoType) => {
    setActiveDemo(demoType);
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleFormSubmit = (formData) => {
    setSubmittedData(formData);
    alert('Form submitted! Check the console for submitted data.');
    console.log('Form submission data:', formData);
  };

  const menuItems = [
    {
      id: 'editor',
      label: 'Form Editor',
      description: 'Build forms with drag-and-drop interface',
      icon: '📝'
    },
    {
      id: 'renderer',
      label: 'Form Renderer',
      description: 'Fill out forms like an end-user',
      icon: '📄'
    }
  ];

  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Fullscreen Exit Button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={exitFullscreen}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-all duration-200 shadow-lg"
          >
            <span>←</span>
            <span>Exit</span>
            <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-red-200 rounded border">ESC</kbd>
          </button>
        </div>

        {/* Fullscreen Content */}
        <div className="h-screen">
          {activeDemo === 'editor' && <FormEditor />}
          {activeDemo === 'renderer' && (
            <div className="h-full flex p-8">
              <div className="max-w-7xl mx-auto flex-1 flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 items-start">
                  {/* Form Renderer */}
                  <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
                    <FormRenderer 
                      hooks={hooks}
                      isVisible={isVisible}
                      onSubmit={handleFormSubmit}
                      showSubmitButton={false}
                      submitButtonText="Submit Form"
                    />
                  </div>
                  
                  {/* Submitted Data Panel - Match Form Height */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col max-h-[calc(100svh-19rem)] lg:max-h-[calc(100dvh-15rem)] overflow-hidden">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Form Data</h3>
                    <h4 className="text-xs font-medium text-green-800 mb-2">Last Submission:</h4>
                    <pre className="text-xs text-gray-700 overflow-y-auto flex-1 bg-gray-50 p-3 rounded text-[10px] leading-tight whitespace-pre-wrap custom-scrollbar">
                      {submittedData ? JSON.stringify(submittedData, null, 2) : ''}
                    </pre>
                  </div>
                </div>
                
                {/* Submit Button - Always visible at bottom */}
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      // Trigger form submission
                      const form = document.querySelector('form');
                      if (form) {
                        const event = new Event('submit', { bubbles: true, cancelable: true });
                        form.dispatchEvent(event);
                      }
                    }}
                    className="w-32 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                  >
                    Submit Form
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome to Questionnaire Builder
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Choose a demo above to explore our packages in fullscreen mode
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {menuItems.map((item) => (
              <div key={item.id} className="text-center">
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.label}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <button
                  onClick={() => enterFullscreen(item.id)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  Launch {item.label}
                  <span className="ml-2">⛶</span>
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-sm text-gray-500">
            <p>💡 Use <kbd className="px-2 py-1 bg-gray-200 rounded">ESC</kbd> key to return to this screen anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}
