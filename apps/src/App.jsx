// Demo Application - Shows how to integrate both Editor and Forms packages
import React, { useState } from "react";
import { FormEditor } from "@questionnaire-builder/editor";
import { FormRenderer } from "@questionnaire-builder/forms";
import { useFormStore, useUIApi, useFormApi, useFieldsArray } from "@questionnaire-builder/editor";
import { isVisible } from "@questionnaire-builder/editor";

/**
 * Demo Application
 * 
 * This demonstrates the complete workflow:
 * 1. Editor Package: Build forms with drag-and-drop interface
 * 2. Forms Package: Render forms for end-users to fill out
 * 
 * Perfect for understanding how both packages work together!
 */
export default function App() {
  const [activeDemo, setActiveDemo] = useState('editor');
  const [submittedData, setSubmittedData] = useState(null);

  // Create hooks object for forms package
  const hooks = {
    useFormStore,
    useUIApi,
    useFormApi,
    useFieldsArray
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Questionnaire Builder Demo
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Experience both form building and form filling
              </p>
            </div>
            
            {/* Demo Mode Switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveDemo(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeDemo === item.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Current Mode Description */}
          <div className="pb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">
                  {menuItems.find(item => item.id === activeDemo)?.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {menuItems.find(item => item.id === activeDemo)?.label}
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    {menuItems.find(item => item.id === activeDemo)?.description}
                  </p>
                  {activeDemo === 'editor' && (
                    <p className="text-xs text-blue-600 mt-2">
                      💡 Create your form here, then switch to "Form Renderer" to see how users interact with it
                    </p>
                  )}
                  {activeDemo === 'renderer' && (
                    <p className="text-xs text-blue-600 mt-2">
                      💡 This shows how end-users would fill out the form you built in the editor
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <main className="relative">
        {activeDemo === 'editor' && (
          <div className="transition-opacity duration-300 ease-in-out">
            <FormEditor />
          </div>
        )}

        {activeDemo === 'renderer' && (
          <div className="transition-opacity duration-300 ease-in-out">
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Form Submission Demo
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Fill out the form below as an end-user would. This demonstrates the FormRenderer component.
                  </p>
                </div>
                
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
      </main>

      {/* Integration Code Examples */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Integration Examples
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Editor Integration */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                🛠️ Form Editor Integration
              </h4>
              <pre className="text-xs text-gray-700 overflow-auto bg-white p-3 rounded border">
{`import { FormEditor } from '@questionnaire-builder/editor';

function AdminPanel() {
  return <FormEditor />;
}`}
              </pre>
            </div>

            {/* Renderer Integration */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                📝 Form Renderer Integration
              </h4>
              <pre className="text-xs text-gray-700 overflow-auto bg-white p-3 rounded border">
{`import { FormRenderer, useFormStore, /* ... */ } from '@questionnaire-builder/editor';

function UserFacingForm() {
  const hooks = { useFormStore, /* ... */ };
  return (
    <FormRenderer 
      hooks={hooks}
      onSubmit={handleSubmit}
    />
  );
}`}
              </pre>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
