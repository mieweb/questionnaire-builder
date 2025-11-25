import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function App() {

  return (
    <div className="app-root w-full h-dvh bg-slate-100">
        <div className="app-editor-container">
          <QuestionnaireEditor/>
        </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);