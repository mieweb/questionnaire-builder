import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EditorView } from './components/EditorView';
import { RendererView } from './components/RendererView';
import './index.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/renderer" replace />} />
        <Route path="/editor" element={<EditorView />} />
        <Route path="/renderer" element={<RendererView />} />
      </Routes>
    </HashRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
