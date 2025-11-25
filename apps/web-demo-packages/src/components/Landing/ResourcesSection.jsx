import React from 'react';

export function ResourcesSection() {
  return (
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
  );
}
