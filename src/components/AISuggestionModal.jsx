import React from "react";

const AISuggestionModal = ({ open, suggestions, onClose, onAdd }) => {
  if (!open) return null;

  return (
    <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">AI Suggestions</h2>
        <ul className="mb-4">
          {suggestions.length === 0 && (
            <li className="text-gray-500">No suggestions found.</li>
          )}
          {suggestions.map((q, idx) => (
            <li
              key={idx}
              className="mb-2 flex items-center justify-between bg-blue-50 rounded px-3 py-2"
            >
              <span className="text-gray-800">{q}</span>
              <button
                className="ml-4 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
                onClick={() => onAdd(q)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
        <button
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AISuggestionModal;