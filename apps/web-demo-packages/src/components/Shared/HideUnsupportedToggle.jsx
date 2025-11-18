import React from 'react';
import { motion } from 'framer-motion';

export function HideUnsupportedToggle({ hideUnsupportedFields, setHideUnsupportedFields }) {
  return (
    <motion.label
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="inline-flex items-center justify-center cursor-pointer bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 px-4 py-3 text-xs tracking-tight rounded-2xl font-medium shadow-lg font-sans hover:bg-white/85 hover:border-white/50 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]"
    >
      <input
        type="checkbox"
        checked={hideUnsupportedFields}
        onChange={(e) => setHideUnsupportedFields(e.target.checked)}
        className="hidden"
      />
      <span className="hidden sm:inline text-slate-600 whitespace-nowrap" title={hideUnsupportedFields ? 'Show unsupported fields' : 'Hide unsupported fields'}>{hideUnsupportedFields ? 'Hide unsupported' : 'Show unsupported'}</span>
      <span className="text-md">{hideUnsupportedFields ? '✅' : '❌'}</span>
    </motion.label>
  );
}
