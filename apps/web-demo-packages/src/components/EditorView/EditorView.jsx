import React from 'react';
import { QuestionnaireEditor } from '@mieweb/forms-editor';
import { TopControls } from '../Shared';

export function EditorView() {
  const [formData, setFormData] = React.useState(null);
  const [hideUnsupportedFields, setHideUnsupportedFields] = React.useState(true);
  const [formKey, setFormKey] = React.useState(0);
  const [selectedExample, setSelectedExample] = React.useState(null);

  const resetFormKey = React.useCallback(() => {
    setFormKey(prev => prev + 1);
  }, []);

  return (
    <div className="demo-app-editor-view w-full h-screen flex flex-col">
      <TopControls
        selectedExample={selectedExample}
        onSelectExample={setSelectedExample}
        onLoadData={(data) => {
          setFormData(data);
          resetFormKey();
        }}
        hideUnsupportedFields={hideUnsupportedFields}
        setHideUnsupportedFields={setHideUnsupportedFields}
      />
      <div className="demo-app-editor-content flex-1 pt-20 bg-gray-100">
        <div className="w-full h-full flex justify-center px-5 min-h-[calc(100vh-10rem)]">
          <div className="w-full max-w-6xl">
            <QuestionnaireEditor
              key={formKey}
              initialFormData={formData}
              onChange={(data) => {
                setFormData(data);
              }}
              hideUnsupportedFields={hideUnsupportedFields}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
