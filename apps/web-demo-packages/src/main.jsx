import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { QuestionnaireEditor } from '@mieweb/forms-editor';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';
import './index.css';

function App() {
  const [formData, setFormData] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(null);
  const [view, setView] = React.useState('landing');
  const [hideUnsupportedFields, setHideUnsupportedFields] = React.useState(true);
  const [formKey, setFormKey] = React.useState(0);

  // ESC to return to landing when not already there
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && view !== 'landing') setView('landing');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [view]);

  const handleFormChange = (data) => {
    // Renderer form change handler - currently unused but keeping for future functionality
  };

  if (view === 'editor') {
    return (
      <div className="w-full relative">
        <FloatingBack onExit={() => setView('landing')} />
        <FloatingExamples 
          onLoadData={(data) => {
            setFormData(data);
            setFormKey(k => k + 1);
          }}
        />
        <FloatingFooter 
          view={view}
          hideUnsupportedFields={hideUnsupportedFields}
          setHideUnsupportedFields={setHideUnsupportedFields}
        />
        <div className="absolute inset-0">
          <QuestionnaireEditor
            key={formKey}
            initialFormData={formData}
            onChange={(data) => {
              setFormData(data);
              setFormKey(k => k + 1);
            }}
            hideUnsupportedFields={hideUnsupportedFields}
          />
        </div>
      </div>
    );
  }

  if (view === 'renderer') {
    const handleSubmit = (e) => {
      e.preventDefault();
      // Note: buildQuestionnaireResponse would need to be accessed from within the renderer
      // or via a ref to the renderer's store. For this demo, we'll just submit the form data.
      setSubmitted(formData);
    };

    return (
      <div className="w-full relative">
        <FloatingBack onExit={() => setView('landing')} />
        <FloatingExamples 
          onLoadData={(data) => {
            setFormData(data);
            setFormKey(k => k + 1);
          }}
        />
        <FloatingFooter 
          view={view}
          hideUnsupportedFields={hideUnsupportedFields}
          setHideUnsupportedFields={setHideUnsupportedFields}
        />
        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <QuestionnaireRenderer
              key={formKey}
              formData={formData}
              onChange={handleFormChange}
              className="p-0 overflow-y-visible"
              hideUnsupportedFields={hideUnsupportedFields}
            />
            <div className="flex w-full mb-10">
              <div className="mx-auto py-4">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-500 text-white font-medium shadow-lg"
                >
                  Submit Questionnaire
                </button>
              </div>
            </div>
          </form>
          {submitted && (
            <pre className="flex mx-auto mt-4 bg-neutral-100 p-4 rounded-lg overflow-auto max-h-96">{JSON.stringify(submitted, null, 2)}</pre>
          )}
        </div>
      </div>
    );
  }

  // Landing
  return (
    <div className="min-h-dvh px-6 md:px-12 py-16 bg-gradient-to-b from-white to-slate-50 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="m-0 mb-4 text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Questionnaire Builder
          </h1>
          <p className="mx-auto max-w-xl leading-relaxed text-lg text-slate-500">
            Professional form builder with FHIR <code className="bg-indigo-100 px-2 py-1 rounded-md text-sm font-medium text-indigo-700">QuestionnaireResponse</code> output
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <DemoCard title="Editor" desc="Build & modify questionnaire structure." onClick={() => setView('editor')} />
          <DemoCard title="Renderer" desc="Fill out the questionnaire & submit." onClick={() => setView('renderer')} />
        </div>

        <Landing />

        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="m-0 text-xs tracking-wider text-slate-400 font-medium">
            Press <kbd className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono text-xs font-semibold text-slate-600">ESC</kbd> to return
          </p>
        </div>
      </div>
    </div>
  );
}

function FloatingBack({ onExit }) {
  return (
    <div className="fixed top-5 right-5 z-50">
      <motion.button
        onClick={onExit}
        title="Back to landing (Esc)"
        aria-label="Back to landing"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 px-4 py-3 text-sm tracking-tight rounded-2xl cursor-pointer font-medium shadow-lg font-sans hover:bg-white/85 hover:border-white/50 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]"
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back</span>
        <span className="bg-slate-100/60 px-2 py-1 rounded-md text-xs font-semibold text-slate-500 border border-slate-200/60 font-mono">ESC</span>
      </motion.button>
    </div>
  );
}

function FloatingFooter({ view, hideUnsupportedFields, setHideUnsupportedFields }) {
  const showToggle = view && view !== 'landing';

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 px-4 py-2.5 text-xs tracking-tight rounded-2xl font-medium shadow-lg font-sans"
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className="inline-flex items-center gap-2">
          <span className="text-slate-500">Press</span>
          <kbd className="bg-slate-100/80 px-2 py-1 rounded-md font-mono text-xs font-semibold text-slate-600 border border-slate-200/60 shadow-sm">ESC</kbd>
          <span className="text-slate-500">to return</span>
        </div>

        {showToggle && (
          <>
            <div className="h-4 w-px bg-slate-300/50" />
            <label className="inline-flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
              <input
                type="checkbox"
                checked={hideUnsupportedFields}
                onChange={(e) => setHideUnsupportedFields(e.target.checked)}
                className="w-3.5 h-3.5 rounded cursor-pointer"
              />
              <span className="text-slate-600">Hide unsupported</span>
            </label>
          </>
        )}
      </motion.div>
    </div>
  );
}

function FloatingExamples({ onLoadData }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedExample, setSelectedExample] = React.useState(null);

  const examples = [
    // { label: '📄 MIE Forms JSON', url: '/examples/inhouse-sample.json', isJson: true / false  },
    { label: '🎖️ NPS (Net Promoter Score) Forms', url: '/examples/netPromoterScoreForm.json', isJson: true},
    { label: '🧑‍⚕️ Patient Survey Form', url: '/examples/patientSurveyForm.json', isJson: true},
    { label: '📝 PHQ-9 Form', url: '/examples/patientHealthQuestionnaireForm.json', isJson: true},
    { label: '📄 Patient Intake Form', url: '/examples/patientIntakeForm.json', isJson: true },



  ];

  const handleLoadExample = async (example) => {
    try {
      const response = await fetch(example.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = example.isJson ? await response.json() : await response.text();
      setSelectedExample(example);
      onLoadData(data);
      setIsOpen(false);
    } catch (err) {
      alert(`Failed to load ${example.label}: ${err.message}`);
    }
  };

  return (
    <div className="fixed left-5 top-5 z-50">
      <div className="relative w-48">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full inline-flex items-center justify-between gap-2 bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 px-4 py-3 text-sm tracking-tight rounded-2xl cursor-pointer font-medium shadow-lg font-sans hover:bg-white/85 hover:border-white/50 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]"
        >
          <span className="font-medium truncate">{selectedExample ? selectedExample.label : '📚 Examples'}</span>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white/70 backdrop-blur-xl backdrop-saturate-150 border border-white/30 rounded-2xl shadow-lg overflow-hidden z-[60]">
            {examples.map((example, index) => (
              <button
                key={example.url}
                onClick={() => handleLoadExample(example)}
                className={`w-full px-4 py-3 text-left text-slate-700 hover:bg-white/60 transition-colors font-medium text-sm ${
                  index < examples.length - 1 ? 'border-b border-white/30' : ''
                } ${selectedExample?.url === example.url ? 'bg-blue-100/50 text-blue-900' : ''}`}
              >
                {example.label}
              </button>
            ))}
          </div>
        )}

        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />
        )}
      </div>
    </div>
  );
}

function DemoCard({ title, desc, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer rounded-3xl p-7 px-6 bg-white/75 backdrop-blur-2xl backdrop-saturate-150 border border-white/40 shadow-xl relative overflow-hidden hover:bg-white/90 hover:border-white/60 hover:shadow-[0_20px_48px_-12px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)]"
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <h3 className="m-0 mb-2.5 text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
      <p className="m-0 text-base leading-relaxed text-slate-500">{desc}</p>
      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-500">
        <span>Explore</span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </motion.svg>
      </div>
    </motion.div>
  );
}

function Landing() {
  return (
    <div className="mt-8">
      <h2 className="m-0 mb-5 text-lg font-semibold text-slate-900 tracking-tight">Packages</h2>
      <div className="grid gap-4 max-w-3xl">
        <InfoRow 
          name="@mieweb/forms-engine" 
          desc="Core state, field primitives & logic utilities." 
          npmLink="https://www.npmjs.com/package/@mieweb/forms-engine"
        />
        <InfoRow 
          name="@mieweb/forms-editor" 
          desc="Embeddable builder (edit + preview)." 
          npmLink="https://www.npmjs.com/package/@mieweb/forms-editor"
        />
        <InfoRow 
          name="@mieweb/forms-renderer" 
          desc="Read‑only renderer producing FHIR QuestionnaireResponse." 
          npmLink="https://www.npmjs.com/package/@mieweb/forms-renderer"
        />
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200">
        <h2 className="m-0 mb-5 text-lg font-semibold text-slate-900 tracking-tight">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          <a
            href="https://github.com/mieweb/questionnaire-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 px-5 bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150 border border-slate-100/80 rounded-xl shadow-md hover:bg-white/80 hover:border-slate-300/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all"
          >
            <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <div>
              <div className="font-semibold text-slate-900">GitHub Repository</div>
              <div className="text-sm text-slate-500">mieweb/questionnaire-builder</div>
            </div>
          </a>

          <a
            href="https://github.com/mieweb/questionnaire-builder/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 px-5 bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150 border border-slate-100/80 rounded-xl shadow-md hover:bg-white/80 hover:border-slate-300/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all"
          >
            <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-semibold text-slate-900">Create Ticket</div>
              <div className="text-sm text-slate-500">Report issues & suggestions</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ name, desc, npmLink }) {
  return (
    <a
      href={npmLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-wrap gap-3 items-center p-4 px-5 bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150 border border-slate-100/80 rounded-xl shadow-md hover:bg-white/80 hover:border-slate-300/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all cursor-pointer"
    >
      <code className="bg-blue-100/70 backdrop-blur-lg px-3 py-2 rounded-lg text-xs tracking-wide font-semibold text-blue-800 border border-blue-200/60 shadow-sm">{name}</code>
      <span className="flex-1 min-w-fit text-sm text-slate-500 leading-relaxed">{desc}</span>
      <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

createRoot(document.getElementById('root')).render(<App />);
