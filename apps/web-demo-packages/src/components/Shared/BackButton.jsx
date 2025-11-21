import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/')}
      title="Back to landing"
      aria-label="Back to landing"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-xl backdrop-saturate-150 text-slate-900 border border-white/30 px-4 py-3 text-sm tracking-tight rounded-2xl cursor-pointer font-medium shadow-lg font-sans hover:bg-white/85 hover:border-white/50 hover:shadow-xl"
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span className="font-medium">Back to home</span>
    </motion.button>
  );
}
