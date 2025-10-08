import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { QuestionnaireEditor } from '@mieweb/forms-editor';
import { QuestionnaireRenderer, useQuestionnaireData } from '@mieweb/forms-renderer';
import './index.css';

const initialFields = [
    {
      id: 'sec-1',
      fieldType: 'section',
      title: 'Patient Information',
      fields: [
        {
          id: 'q-name',
          fieldType: 'input',
          question: 'Full Name',
          answer: ''
        },
        {
          id: 'q-dob',
          fieldType: 'input',
          question: 'Date of Birth',
          answer: ''
        },
        {
          id: 'q-gender',
          fieldType: 'radio',
          question: 'Biological sex',
          options: [
            { id: 'gender-male', value: 'Male' },
            { id: 'gender-female', value: 'Female' },
            { id: 'gender-other', value: 'Other' }
          ],
          selected: null
        },
        {
          id: 'q-email',
          fieldType: 'input',
          question: 'Email address',
          answer: ''
        }
      ]
    },
    {
      id: 'sec-pregnancy',
      fieldType: 'section',
      title: 'Pregnancy Information',
      enableWhen: {
        logic: 'AND',
        conditions: [
          { targetId: 'q-gender', operator: 'equals', value: 'gender-female' }
        ]
      },
      fields: [
        {
          id: 'q-pregnant',
          fieldType: 'radio',
          question: 'Are you currently pregnant?',
          options: [
            { id: 'preg-yes', value: 'Yes' },
            { id: 'preg-no', value: 'No' }
          ],
          selected: null
        },
        {
          id: 'q-weeks',
          fieldType: 'input',
          question: 'Weeks gestation (if known)',
          answer: '',
          enableWhen: {
            logic: 'AND',
            conditions: [
              { targetId: 'q-pregnant', operator: 'equals', value: 'preg-yes' }
            ]
          }
        }
      ]
    },
    {
      id: 'sec-2',
      fieldType: 'section',
      title: 'Medical History',
      fields: [
        {
          id: 'q-medications',
          fieldType: 'radio',
          question: 'Are you currently taking any medications?',
          options: [
            { id: 'meds-yes', value: 'Yes' },
            { id: 'meds-no', value: 'No' }
          ],
          selected: null
        },
        {
          id: 'q-med-list',
          fieldType: 'input',
          question: 'List current medications (name, dose, frequency)',
          answer: '',
          enableWhen: {
            logic: 'AND',
            conditions: [
              { targetId: 'q-medications', operator: 'equals', value: 'meds-yes' }
            ]
          }
        },
        {
          id: 'q-conditions',
          fieldType: 'check',
          question: 'Do you have any of the following conditions? (Check all that apply)',
          options: [
            { id: 'cond-diabetes', value: 'Diabetes' },
            { id: 'cond-hypertension', value: 'Hypertension' },
            { id: 'cond-asthma', value: 'Asthma' },
            { id: 'cond-heart', value: 'Heart Disease' },
            { id: 'cond-other', value: 'Other (specify below)' }
          ],
          selected: []
        },
        {
          id: 'q-conditions-other',
          fieldType: 'input',
          question: 'Please specify other conditions',
          answer: '',
          enableWhen: {
            logic: 'OR',
            conditions: [
              { targetId: 'q-conditions', operator: 'includes', value: 'cond-other' }
            ]
          }
        },
        {
          id: 'q-allergies',
          fieldType: 'check',
          question: 'Known allergies (select all that apply)',
          options: [
            { id: 'alg-none', value: 'No known allergies' },
            { id: 'alg-penicillin', value: 'Penicillin' },
            { id: 'alg-peanut', value: 'Peanuts' },
            { id: 'alg-other', value: 'Other (specify below)' }
          ],
          selected: []
        },
        {
          id: 'q-allergy-details',
          fieldType: 'input',
          question: 'Please specify allergy details (reaction, severity)',
          answer: '',
          enableWhen: {
            logic: 'OR',
            conditions: [
              { targetId: 'q-allergies', operator: 'includes', value: 'alg-penicillin' },
              { targetId: 'q-allergies', operator: 'includes', value: 'alg-peanut' },
              { targetId: 'q-allergies', operator: 'includes', value: 'alg-other' }
            ]
          }
        }
      ]
    },
    {
      id: 'q-notes',
      fieldType: 'input',
      question: 'Additional notes or comments',
      answer: ''
    }
  ];

// Custom wrapper demonstrating how to use the renderer with your own submit button
function RendererWithSubmit({ fields, onChange, onSubmit }) {
  const { getQuestionnaireResponse } = useQuestionnaireData('demo-1', 'patient-123');

  const handleSubmit = (e) => {
    e.preventDefault();
    const fhirResponse = getQuestionnaireResponse();
    onSubmit(fhirResponse);
  };

  return (
    <form onSubmit={handleSubmit}>
      <QuestionnaireRenderer fields={fields} onChange={onChange} />
      <div className="pt-4">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-blue-500 text-white font-medium shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all active:scale-95"
        >
          Submit Questionnaire
        </button>
      </div>
    </form>
  );
}

function App() {
  const [fields, setFields] = React.useState(initialFields);
  const [submitted, setSubmitted] = React.useState(null);
  const [view, setView] = React.useState('landing');

  // ESC to return to landing when not already there
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && view !== 'landing') setView('landing');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [view]);

  const handleFormChange = (data) => {
    console.log('Form data changed:', data)
  };

  if (view === 'editor') {
    return (
      <div className="w-full h-dvh relative bg-slate-100">
        <FloatingBack onExit={() => setView('landing')} />
        <FloatingFooter />
        <div className="absolute inset-0 overflow-auto">
          <QuestionnaireEditor initialFields={fields} onChange={setFields} />
        </div>
      </div>
    );
  }

  if (view === 'renderer') {
    return (
      <div className="w-full h-dvh relative bg-slate-100">
        <FloatingBack onExit={() => setView('landing')} />
        <FloatingFooter />
        <div className="absolute inset-0 overflow-auto p-4 max-w-4xl mx-auto w-full">
          <RendererWithSubmit 
            fields={fields}
            onChange={handleFormChange}
            onSubmit={(qr) => setSubmitted(qr)}
          />
          {submitted && (
            <pre className="mt-4 bg-neutral-100 p-4 rounded-lg">{JSON.stringify(submitted, null, 2)}</pre>
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
        className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 px-4 py-3 text-sm tracking-tight rounded-2xl cursor-pointer font-medium shadow-lg font-sans"
        whileHover={{
          background: 'rgba(255, 255, 255, 0.85)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)'
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span className="font-medium">Back</span>
        <span className="bg-slate-100/60 px-2 py-1 rounded-md text-xs font-semibold text-slate-500 border border-slate-200/60 font-mono">ESC</span>
      </motion.button>
    </div>
  );
}

function FloatingFooter() {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 px-4 py-2.5 text-xs tracking-tight rounded-2xl font-medium shadow-lg font-sans"
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <span className="text-slate-500">Press</span>
        <kbd className="bg-slate-100/80 px-2 py-1 rounded-md font-mono text-xs font-semibold text-slate-600 border border-slate-200/60 shadow-sm">ESC</kbd>
        <span className="text-slate-500">to return</span>
      </motion.div>
    </div>
  );
}

function DemoCard({ title, desc, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className="cursor-pointer rounded-3xl p-7 px-6 bg-white/75 backdrop-blur-2xl backdrop-saturate-150 border border-white/40 shadow-xl relative overflow-hidden"
      whileHover={{
        y: -4,
        background: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.6)',
        boxShadow: '0 20px 48px -12px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)'
      }}
      whileTap={{ scale: 0.98 }}
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
          <path d="M5 12h14M12 5l7 7-7 7"/>
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
        <InfoRow name="@mieweb/forms-engine" desc="Core state, field primitives & logic utilities." />
        <InfoRow name="@mieweb/forms-editor" desc="Embeddable builder (edit + preview)." />
        <InfoRow name="@mieweb/forms-renderer" desc="Read‑only renderer producing FHIR QuestionnaireResponse." />
      </div>
    </div>
  );
}

function InfoRow({ name, desc }) {
  return (
    <motion.div 
      className="flex flex-wrap gap-3 items-center p-4 px-5 bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150 border border-slate-100/80 rounded-xl shadow-md"
      whileHover={{
        background: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(203, 213, 225, 0.6)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <code className="bg-blue-100/70 backdrop-blur-lg px-3 py-2 rounded-lg text-xs tracking-wide font-semibold text-blue-800 border border-blue-200/60 shadow-sm">{name}</code>
      <span className="flex-1 min-w-fit text-sm text-slate-500 leading-relaxed">{desc}</span>
    </motion.div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
