import React from 'react';

/**
 * Submit button for questionnaire
 */
export function SubmitButton({ className = '' }) {
  return (
    <div className={`pt-2 ${className}`}>
      <button 
        type="submit" 
        className="px-4 py-2 rounded bg-[#0076a8] text-white shadow hover:bg-[#00628a] transition-colors"
      >
        Submit
      </button>
    </div>
  );
}
