import React from 'react';
import { QuestionnaireEditor } from '@mieweb/forms-editor';
import { MenuDropdown } from '../Shared';

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
      <div className="demo-app-editor-content flex-1 overflow-y-auto bg-gray-100">
        <div className="w-full flex justify-center px-5 pt-5">
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
  );
}
