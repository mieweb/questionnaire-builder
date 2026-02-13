import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/Landing';
import { EditorView } from './components/EditorView';
import { RendererView } from './components/RendererView';
import { PlaygroundView } from './components/Playground';
import { Navbar } from './components/Shared';
import './index.css';

// eslint-disable-next-line react-refresh/only-export-components -- app entry point, no exports needed
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/packages/editor" element={<EditorView />} />
        <Route path="/packages/renderer" element={<RendererView />} />
        <Route path="/devPlayGround" element={<PlaygroundView />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
