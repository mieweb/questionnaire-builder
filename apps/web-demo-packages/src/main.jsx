import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { QuestionnaireEditor } from '@mieweb/forms-editor';
import { QuestionnaireRenderer, buildQuestionnaireResponse, useFieldsArray } from '@mieweb/forms-renderer';
import { useUIStore } from '@mieweb/forms-engine';
import './index.css';

const initialFormData = {
  "title": "General Health Screening",
  "description": "Quick intake screening for symptoms, risks, and well-being.",
  "showProgressBar": "top",
  "progressBarType": "questions",
  "showQuestionNumbers": "onPage",
  "completedHtml": "<h3>Thanks!</h3><p>Your screening has been submitted.</p>",
  "calculatedValues": [
    { "name": "phq2_total", "expression": "sum({phq2_item1}, {phq2_item2})" }
  ],
  "pages": [
    {
      "name": "screening_panels",
      "title": "Health Screening",
      "elements": [
        {
          "type": "panel",
          "name": "sec_patient_info",
          "title": "Patient Information",
          "elements": [
            { "type": "text", "name": "full_name", "title": "Full Name", "isRequired": true },
            { "type": "text", "name": "dob", "title": "Date of Birth", "inputType": "date", "isRequired": true },
            {
              "type": "dropdown",
              "name": "sex_at_birth",
              "title": "Sex at Birth",
              "isRequired": true,
              "choices": ["Female", "Male", "Intersex", "Prefer not to say"]
            },
            { "type": "text", "name": "contact_phone", "title": "Phone", "inputType": "tel" },
            { "type": "text", "name": "contact_email", "title": "Email", "inputType": "email", "validators": [{ "type": "email" }] },
            { "type": "boolean", "name": "consent", "title": "I consent to screening and data collection for care.", "isRequired": true, "labelTrue": "Yes", "labelFalse": "No" },
            { "type": "html", "name": "consent_blocker", "visibleIf": "{consent} = false", "html": "<div style='color:#b00020'><b>Consent required to proceed.</b></div>" }
          ]
        },
        {
          "type": "panel",
          "name": "sec_presenting",
          "title": "Presenting Concerns",
          "visibleIf": "{consent} = true",
          "elements": [
            {
              "type": "comment",
              "name": "chief_complaint",
              "title": "Chief Concern",
              "placeHolder": "Briefly describe your main concern today",
              "isRequired": true
            },
            {
              "type": "checkbox",
              "name": "symptoms",
              "title": "Current Symptoms (check all that apply)",
              "choices": [
                "Fever or chills",
                "Cough",
                "Shortness of breath",
                "Chest pain",
                "Headache",
                "Sore throat",
                "Nausea or vomiting",
                "Diarrhea",
                "Fatigue",
                "Body aches",
                "Loss of taste or smell",
                "Rash",
                "None of the above"
              ],
              "hasOther": true,
              "otherText": "Other"
            },
            {
              "type": "boolean",
              "name": "red_flags",
              "title": "Any severe symptoms (e.g., severe chest pain, difficulty breathing, confusion, bluish lips/face)?",
              "labelTrue": "Yes",
              "labelFalse": "No",
              "isRequired": true
            },
            {
              "type": "comment",
              "name": "red_flags_details",
              "title": "Please describe severe symptoms",
              "visibleIf": "{red_flags} = true",
              "isRequired": true
            }
          ]
        },
        {
          "type": "panel",
          "name": "sec_vitals",
          "title": "Self-Reported Vitals",
          "visibleIf": "{consent} = true",
          "elements": [
            { "type": "text", "name": "height_cm", "title": "Height (cm)", "inputType": "number", "min": 30, "max": 250 },
            { "type": "text", "name": "weight_kg", "title": "Weight (kg)", "inputType": "number", "min": 2, "max": 400 },
            { "type": "text", "name": "temp_c", "title": "Temperature (°C)", "inputType": "number", "min": 32, "max": 43 },
            { "type": "text", "name": "sbp", "title": "Systolic Blood Pressure (mmHg)", "inputType": "number", "min": 60, "max": 260 },
            { "type": "text", "name": "dbp", "title": "Diastolic Blood Pressure (mmHg)", "inputType": "number", "min": 30, "max": 160 },
            { "type": "text", "name": "pulse", "title": "Heart Rate (bpm)", "inputType": "number", "min": 20, "max": 220 }
          ]
        },
        {
          "type": "panel",
          "name": "sec_phq2",
          "title": "Well-Being (PHQ-2)",
          "visibleIf": "{consent} = true",
          "elements": [
            {
              "type": "radiogroup",
              "name": "phq2_item1",
              "title": "Over the last 2 weeks, how often have you had little interest or pleasure in doing things?",
              "isRequired": true,
              "choices": [
                { "value": 0, "text": "Not at all (0)" },
                { "value": 1, "text": "Several days (1)" },
                { "value": 2, "text": "More than half the days (2)" },
                { "value": 3, "text": "Nearly every day (3)" }
              ]
            },
            {
              "type": "radiogroup",
              "name": "phq2_item2",
              "title": "Over the last 2 weeks, how often have you felt down, depressed, or hopeless?",
              "isRequired": true,
              "choices": [
                { "value": 0, "text": "Not at all (0)" },
                { "value": 1, "text": "Several days (1)" },
                { "value": 2, "text": "More than half the days (2)" },
                { "value": 3, "text": "Nearly every day (3)" }
              ]
            },
            {
              "type": "html",
              "name": "phq2_score",
              "title": "PHQ-2 Score",
              "html": "<div>PHQ-2 total: <b>{phq2_total}</b> (≥3 suggests further screening)</div>"
            }
          ]
        },
        {
          "type": "panel",
          "name": "sec_risk_social",
          "title": "Risk Factors & Social",
          "visibleIf": "{consent} = true",
          "elements": [
            {
              "type": "checkbox",
              "name": "medical_history",
              "title": "Medical History (check all that apply)",
              "choices": [
                "Diabetes",
                "Hypertension",
                "Heart disease",
                "Asthma/COPD",
                "Chronic kidney disease",
                "Cancer",
                "Pregnancy",
                "Immunosuppression",
                "None of the above"
              ],
              "hasOther": true
            },
            {
              "type": "boolean",
              "name": "pregnant",
              "title": "Are you currently pregnant?",
              "labelTrue": "Yes",
              "labelFalse": "No",
              "visibleIf": "{sex_at_birth} = 'Female'"
            },
            {
              "type": "radiogroup",
              "name": "tobacco_use",
              "title": "Tobacco Use",
              "choices": ["Never", "Former", "Current"]
            },
            {
              "type": "radiogroup",
              "name": "alcohol_use",
              "title": "Alcohol Use",
              "choices": ["None", "Occasional", "Weekly", "Daily"]
            },
            {
              "type": "radiogroup",
              "name": "housing_security",
              "title": "Do you have stable housing?",
              "choices": ["Yes", "No", "Prefer not to say"]
            },
            {
              "type": "radiogroup",
              "name": "food_security",
              "title": "In the last 12 months, were you ever worried food would run out before you had money to buy more?",
              "choices": ["Often true", "Sometimes true", "Never true", "Prefer not to say"]
            }
          ]
        },
        {
          "type": "panel",
          "name": "sec_infectious",
          "title": "Infectious Screening (Respiratory/COVID-like)",
          "visibleIf": "{consent} = true",
          "elements": [
            { "type": "boolean", "name": "close_contact", "title": "Close contact with a sick person in past 10 days?", "labelTrue": "Yes", "labelFalse": "No" },
            { "type": "radiogroup", "name": "fever_history", "title": "Fever in the last 48 hours?", "choices": ["Yes", "No", "Unsure"] },
            { "type": "radiogroup", "name": "resp_symptoms", "title": "Respiratory symptoms now?", "choices": ["None", "Mild", "Moderate", "Severe"] }
          ]
        },
        {
          "type": "panel",
          "name": "sec_review",
          "title": "Review & Submit",
          "visibleIf": "{consent} = true",
          "elements": [
            { "type": "signaturepad", "name": "signature", "title": "Signature (optional)" },
            { "type": "comment", "name": "notes", "title": "Anything else you'd like to add?" }
          ]
        }
      ]
    }
  ]
};

// Custom wrapper demonstrating how to use the renderer with your own submit button
function RendererWithSubmit({ formData, onChange, onSubmit }) {
  const currentFields = useFieldsArray();
  const hideUnsupportedFields = useUIStore((s) => s.hideUnsupportedFields);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fhirResponse = buildQuestionnaireResponse(currentFields, 'demo-1', 'patient-123');
    onSubmit(fhirResponse);
  };

  return (
    <form onSubmit={handleSubmit}>
      <QuestionnaireRenderer
        formData={formData}
        onChange={onChange}
        hideUnsupportedFields={hideUnsupportedFields}
      />
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
  const [formData, setFormData] = React.useState(initialFormData);
  const [submitted, setSubmitted] = React.useState(null);
  const [view, setView] = React.useState('landing');
  const [surveySchema, setSurveySchema] = React.useState(null);

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

  const loadSurveyJS = async () => {
    try {
      const response = await fetch('/examples/surveyjs-sample.json');
      const data = await response.json();
      // Pass SurveyJS data directly - will be auto-converted
      setFormData(data);
      setView('editor');
    } catch (err) {
      alert('Failed to load SurveyJS sample: ' + err.message);
    }
  };

  const loadMIEFormsJSON = async () => {
    try {
      const response = await fetch('/examples/inhouse-sample.json');
      const data = await response.json();
      setFormData(data); // Pass complete form data with metadata
      setView('editor');
    } catch (err) {
      alert('Failed to load MIE Forms JSON sample: ' + err.message);
    }
  };

  const loadMIEFormsYAML = async () => {
    try {
      const response = await fetch('/examples/inhouse-sample.yaml');
      const yamlText = await response.text();
      // Pass YAML string directly - will be auto-parsed
      setFormData(yamlText);
      setView('editor');
    } catch (err) {
      alert('Failed to load MIE Forms YAML sample: ' + err.message);
    }
  };

  if (view === 'editor') {
    return (
      <div className="w-full h-dvh relative bg-slate-100">
        <FloatingBack onExit={() => setView('landing')} />
        <FloatingFooter view={view} />
        <div className="absolute inset-0">
          <QuestionnaireEditor initialFormData={formData} onChange={setFormData} />
        </div>
      </div>
    );
  }

  if (view === 'renderer') {
    return (
      <div className="w-full h-dvh relative bg-slate-100">
        <FloatingBack onExit={() => setView('landing')} />
        <FloatingFooter view={view} />
        <div className="">
          <RendererWithSubmit
            formData={formData}
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

        <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <h2 className="m-0 mb-3 text-lg font-semibold text-slate-900 tracking-tight">Test Auto-Detection</h2>
          <p className="mb-4 text-sm text-slate-600">Load example schemas to test YAML parsing and automatic format detection:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={loadMIEFormsJSON}
              className="px-4 py-2.5 bg-white text-slate-700 rounded-lg border border-slate-200 font-medium text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow"
            >
              📄 MIE Forms JSON
            </button>
            <button
              onClick={loadMIEFormsYAML}
              className="px-4 py-2.5 bg-white text-slate-700 rounded-lg border border-slate-200 font-medium text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow"
            >
              📝 MIE Forms YAML
            </button>
            <button
              onClick={loadSurveyJS}
              className="px-4 py-2.5 bg-white text-slate-700 rounded-lg border border-slate-200 font-medium text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow"
            >
              🔄 SurveyJS JSON
            </button>
          </div>
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

function FloatingFooter({ view }) {
  const showToggle = view && view !== 'landing';
  const hideUnsupported = useUIStore((s) => s.hideUnsupportedFields);
  const setHideUnsupportedFields = useUIStore((s) => s.setHideUnsupportedFields);

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
                checked={hideUnsupported}
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
      whileHover={{ scale: 1.01, y: -2 }}
      className="flex flex-wrap gap-3 items-center p-4 px-5 bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150 border border-slate-100/80 rounded-xl shadow-md hover:bg-white/80 hover:border-slate-300/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]"
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <code className="bg-blue-100/70 backdrop-blur-lg px-3 py-2 rounded-lg text-xs tracking-wide font-semibold text-blue-800 border border-blue-200/60 shadow-sm">{name}</code>
      <span className="flex-1 min-w-fit text-sm text-slate-500 leading-relaxed">{desc}</span>
    </motion.div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
