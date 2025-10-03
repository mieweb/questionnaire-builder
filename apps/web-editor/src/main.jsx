import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function App() {
  const [fields, setFields] = React.useState([
    { id: 'section-1', fieldType: 'section', title: 'Section 1', fields: [] },
    { id: 'name', fieldType: 'input', question: 'Your Name', required: true },
    { id: 'gender', fieldType: 'radio', question: 'Gender', options: [{ value: 'Male' }, { value: 'Female' }], selected: null },
  ]);

  return (
    <div className="w-full h-dvh bg-slate-100">
      <div className="absolute inset-0 overflow-auto">
        <QuestionnaireEditor
          initialFields={fields}
          onChange={setFields}
        />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);