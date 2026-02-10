import React from 'react';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';
import { MenuDropdown } from '../Shared';

export function RendererView() {
  const [formData, setFormData] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(null);
  const [hideUnsupportedFields, setHideUnsupportedFields] = React.useState(true);
  const [formKey, setFormKey] = React.useState(0);
  const [selectedExample, setSelectedExample] = React.useState(null);

  const resetFormKey = React.useCallback(() => {
    setFormKey(prev => prev + 1);
  }, []);

  const handleFormChange = (data) => {
    // Renderer form change handler - currently unused but keeping for future functionality
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setFormData(data);
        resetFormKey();
      } catch (err) {
        alert(`Failed to parse JSON: ${err}`);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(formData);
  };

  return (
    <div className="demo-app-renderer-view w-full min-h-screen relative">
      <MenuDropdown
        selectedExample={selectedExample}
        onSelectExample={setSelectedExample}
        onLoadData={(data) => {
          setFormData(data);
          resetFormKey();
        }}
        hideUnsupportedFields={hideUnsupportedFields}
        setHideUnsupportedFields={setHideUnsupportedFields}
      />
      <div className="demo-app-renderer-content w-full pt-20 pb-20 bg-gray-100">
        {!formData ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] gap-6">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">No Form Loaded</h2>
              <p className="text-slate-600 mb-6">
                Use the <span className="font-semibold">Examples</span> dropdown in the top left to load a questionnaire, or import your own form.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100/70 text-green-800 font-medium hover:bg-green-200/70 transition-colors cursor-pointer border border-green-200/60">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Import Form
                <input
                  id="renderer-view-import"
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <form className="demo-app-renderer-form" onSubmit={handleSubmit}>
            <QuestionnaireRenderer
              key={formKey}
              formData={formData}
              onChange={handleFormChange}
              className="p-0 overflow-y-visible"
              hideUnsupportedFields={hideUnsupportedFields}
            />
            {formData && (
              <div className="demo-app-renderer-submit-container flex w-full mb-10">
                <div className="demo-app-renderer-submit-button-wrapper mx-auto py-4">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-green-600 text-white font-medium shadow-lg"
                  >
                    Submit Questionnaire
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
        {submitted && (
          <pre className="demo-app-response-display flex mx-auto mt-4 bg-neutral-100 p-4 rounded-lg overflow-auto max-h-96">{JSON.stringify(submitted, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
