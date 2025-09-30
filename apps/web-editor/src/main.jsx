import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function App() {
  const [fields, setFields] = React.useState([
    { id: 'section-1', fieldType: 'section', title: 'Section 1', fields: [] },
    { id: 'name', fieldType: 'input', question: 'Your Name', required: true },
  ]);

  return (
    <div className="min-h-screen">
      <QuestionnaireEditor
        initialFields={fields}
        onChange={setFields}
      />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);