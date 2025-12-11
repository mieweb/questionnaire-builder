import React from 'react';
import { motion } from 'framer-motion';
import { MENU_ICON, X_ICON } from '../../assets/icon';
import { ExamplesDropdown } from './ExamplesDropdown';
import { HideUnsupportedToggle } from './HideUnsupportedToggle';
import { BackButton } from './BackButton';

export function MenuDropdown({
  selectedExample,
  onSelectExample,
  onLoadData,
  hideUnsupportedFields,
  setHideUnsupportedFields,
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed top-6 right-3 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 p-3 rounded-2xl shadow-lg hover:bg-white/85 hover:border-white/50 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all"
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
          initial={{ opacity: 1, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute top-full mt-3 right-0 z-[60] space-y-3 flex flex-col items-end w-48"
        >
          <BackButton />
          <HideUnsupportedToggle
            hideUnsupportedFields={hideUnsupportedFields}
            setHideUnsupportedFields={setHideUnsupportedFields}
          />
          <ExamplesDropdown
            selectedExample={selectedExample}
            onSelectExample={onSelectExample}
            onLoadData={onLoadData}
          />
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
