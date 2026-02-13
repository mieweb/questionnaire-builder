import { motion } from 'framer-motion';
import { CHECK_ICON, X_ICON } from '../../assets/icon';

export function HideUnsupportedToggle({ hideUnsupportedFields, setHideUnsupportedFields }) {
  return (
    <motion.label
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="w-full inline-flex items-center gap-2 cursor-pointer bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 px-4 py-3 text-xs tracking-tight rounded-2xl font-medium shadow-lg font-sans hover:bg-white/85 hover:border-white/50 hover:shadow-xl"
    >
      <input
        id="hide-unsupported-toggle"
        type="checkbox"
        checked={hideUnsupportedFields}
        onChange={(e) => setHideUnsupportedFields(e.target.checked)}
        className="hidden"
      />
      {hideUnsupportedFields ? (
        <CHECK_ICON className="w-4 h-4 text-green-600 shrink-0" />
      ) : (
        <X_ICON className="w-4 h-4 text-red-600 shrink-0" />
      )}
      <span className="text-slate-600 whitespace-nowrap" title={hideUnsupportedFields ? 'Show unsupported fields' : 'Hide unsupported fields'}>{hideUnsupportedFields ? 'Hide unsupported' : 'Show unsupported'}</span>
    </motion.label>
  );
}
