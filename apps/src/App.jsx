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
      icon: '🛠️'
    },
    {
      id: 'renderer',
      label: 'Form Renderer',
      description: 'Fill out forms like an end-user',
      icon: '📝'
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
            <div className="h-full overflow-auto p-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <FormRenderer 
                    hooks={hooks}
                    isVisible={isVisible}
                    onSubmit={handleFormSubmit}
                    showSubmitButton={true}
                    submitButtonText="Submit Form"
                  />
                  
                  {submittedData && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-medium text-green-800 mb-2">Last Submission:</h3>
                      <pre className="text-xs text-green-700 overflow-auto">
                        {JSON.stringify(submittedData, null, 2)}
                      </pre>
                    </div>
                  )}
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
