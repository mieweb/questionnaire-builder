import React from 'react';
import { motion } from 'framer-motion';

export function ExamplesDropdown({ selectedExample, onSelectExample, onLoadData }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const baseUrl = import.meta.env.BASE_URL || '/';

  const examples = [
    { label: '🎖️ NPS (Net Promoter Score) Forms', url: `${baseUrl}examples/netPromoterScoreForm.json`, isJson: true },
    { label: '🧑‍⚕️ Patient Survey Form', url: `${baseUrl}examples/patientSurveyForm.json`, isJson: true },
    { label: '📝 PHQ-9 Form', url: `${baseUrl}examples/patientHealthQuestionnaireForm.json`, isJson: true },
    { label: '📄 Patient Intake Form', url: `${baseUrl}examples/patientIntakeForm.json`, isJson: true },
  ];

  const handleLoadExample = async (example) => {
    try {
      const response = await fetch(example.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = example.isJson ? await response.json() : await response.text();
      onSelectExample(example);
      onLoadData(data);
      setIsOpen(false);
    } catch (err) {
      alert(`Failed to load ${example.label}: ${err.message}`);
    }
  };

  return (
    <motion.div 
      className="floating-examples"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="floating-examples-dropdown relative w-48">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="floating-examples-button w-full inline-flex items-center justify-between gap-2 bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 px-4 py-3 text-sm tracking-tight rounded-2xl cursor-pointer font-medium shadow-lg font-sans hover:bg-white/85 hover:border-white/50 hover:shadow-xl"
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
            className={`transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.button>

        {isOpen && (
          <div className="floating-examples-menu absolute top-full mt-2 left-0 right-0 bg-white/70 backdrop-blur-xl backdrop-saturate-150 border border-white/30 rounded-2xl shadow-lg overflow-hidden z-60">
            {examples.map((example, index) => (
              <button
                key={example.url}
                onClick={() => handleLoadExample(example)}
                className={`floating-examples-menu-item w-full px-4 py-3 text-left text-slate-700 hover:bg-white/60 transition-colors font-medium text-sm ${
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
            className="floating-examples-backdrop fixed inset-0 z-40"
          />
        )}
      </div>
    </motion.div>
  );
}
