import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function App() {

  return (
    <div className="w-full h-dvh bg-slate-100">
        <QuestionnaireEditor/>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);