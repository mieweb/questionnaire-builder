import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function DemoCard({ title, desc, to }) {
  return (
    <Link to={to}>
      <motion.div
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
    </Link>
  );
}
