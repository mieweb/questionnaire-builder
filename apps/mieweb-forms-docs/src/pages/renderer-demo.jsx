import React from 'react';
import Layout from '@theme/Layout';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';
import * as yaml from 'js-yaml';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { StreamLanguage } from '@codemirror/language';
import { yaml as yamlMode } from '@codemirror/legacy-modes/mode/yaml';

export default function RendererDemo() {
  const initialFormData = {
    schemaType: 'mieforms-v1.0',
    title: 'Patient Health Survey',
    description: 'Please complete this health assessment form',
    fields: [
      {
        id: 'section-1',
        fieldType: 'section',
        title: 'Personal Information',
        fields: [
          {
            id: 'fullname',
            fieldType: 'text',
            question: 'What is your full name?',
            required: true,
            answer: ''
          },
          {
            id: 'dob',
            fieldType: 'text',
            question: 'Date of birth',
            answer: ''
          }
        ]
      }
    ]
  };

  const [inputMode, setInputMode] = React.useState('json');
  const [jsonInput, setJsonInput] = React.useState(JSON.stringify(initialFormData, null, 2));
  const [formData, setFormData] = React.useState(initialFormData);
  const [error, setError] = React.useState(null);

  const handleModeSwitch = (mode) => {
    if (mode === inputMode) return;
    
    try {
      if (mode === 'yaml') {
        // Convert JSON to YAML
        const parsed = inputMode === 'json' ? JSON.parse(jsonInput) : yaml.load(jsonInput);
        setJsonInput(yaml.dump(parsed, { indent: 2 }));
      } else {
        // Convert YAML to JSON
        const parsed = inputMode === 'yaml' ? yaml.load(jsonInput) : JSON.parse(jsonInput);
        setJsonInput(JSON.stringify(parsed, null, 2));
      }
      setInputMode(mode);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (value) => {
    setJsonInput(value);
    
    try {
      const parsed = inputMode === 'json' ? JSON.parse(value) : yaml.load(value);
      setFormData(parsed);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout
      title="Renderer Demo"
      description="Interactive demo of the MIE Forms Renderer">
      <div className="container py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold mb-4 bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Forms Renderer Demo</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Enter your form JSON or YAML below to see it rendered in real-time with live validation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col h-162.5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold m-0 text-slate-800">Input Editor</h3>
                <div className="inline-flex bg-slate-100 rounded-xl p-1 gap-1 shadow-sm">
                  <button
                    onClick={() => handleModeSwitch('json')}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      inputMode === 'json' 
                        ? 'bg-white text-slate-900 shadow-md' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}>
                    JSON
                  </button>
                  <button
                    onClick={() => handleModeSwitch('yaml')}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      inputMode === 'yaml' 
                        ? 'bg-white text-slate-900 shadow-md' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}>
                    YAML
                  </button>
                </div>
              </div>
              <div className="flex-1 relative">
                <CodeMirror
                  value={jsonInput}
                  extensions={[inputMode === 'json' ? json() : StreamLanguage.define(yamlMode)]}
                  onChange={handleInputChange}
                  theme="dark"
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightActiveLine: true,
                    foldGutter: true,
                  }}
                  className="custom-scrollbar rounded-xl overflow-hidden shadow-xl h-full border-none"
                />
              </div>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg text-sm shadow-sm">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <strong className="font-semibold">Invalid {inputMode.toUpperCase()}:</strong>
                      <p className="mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col h-162.5">
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Live Preview</h3>
              <div className="custom-scrollbar rendered-output bg-linear-to-br from-slate-50 to-white p-8 rounded-xl shadow-xl overflow-y-auto flex-1 border border-slate-200">
                {!error && <QuestionnaireRenderer key={JSON.stringify(formData)} formData={formData} />}
                {error && (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">Fix the errors to see preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
