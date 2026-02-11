import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MENU_ICON, X_ICON } from '../../assets/icon';
import { ExamplesDropdown } from './ExamplesDropdown';
import { HideUnsupportedToggle } from './HideUnsupportedToggle';

export function MenuDropdown({
  selectedExample,
  onSelectExample,
  onLoadData,
  hideUnsupportedFields,
  setHideUnsupportedFields,
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const showExamples = onSelectExample && onLoadData;
  const showHideToggle = setHideUnsupportedFields !== undefined;

  return (
    <div className="fixed top-2 right-3 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 p-3 rounded-2xl shadow-lg hover:bg-white/85 hover:border-white/50 hover:shadow-2xl transition-all"
        title="Menu"
      >
        {isOpen ? (
          <X_ICON className="w-5 h-5" />
        ) : (
          <MENU_ICON className="w-5 h-5" />
        )}
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute top-full mt-3 right-0 z-60 space-y-3 flex flex-col items-end w-48"
        >
          <Link
            to="/"
            className="back-to-home-btn w-full bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 px-4 py-2.5 rounded-2xl shadow-lg hover:bg-white/85 hover:border-white/50 hover:shadow-2xl transition-all text-center text-sm font-medium"
          >
            ← Back to Home
          </Link>
          {showHideToggle && (
            <HideUnsupportedToggle
              hideUnsupportedFields={hideUnsupportedFields}
              setHideUnsupportedFields={setHideUnsupportedFields}
            />
          )}
          {showExamples && (
            <ExamplesDropdown
              selectedExample={selectedExample}
              onSelectExample={onSelectExample}
              onLoadData={onLoadData}
            />
          )}
        </motion.div>
      )}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}
    </div>
  );
}
