import React from 'react';

function UnsupportedField({ field }) {
  const [showDetails, setShowDetails] = React.useState(false);
  
  const unsupportedType = field.unsupportedType || 'unknown';
  const data = field.unsupportedData || field._sourceData || {};
  
  return (
    <div className="unsupported-field-container border-2 border-dashed border-orange-500 rounded-lg p-4 bg-orange-50 mb-4">
      <div className="unsupported-field-header flex items-center gap-2 mb-2">
        <span className="text-xl">⚠️</span>
        <div className="flex-1">
          <strong className="text-orange-700">Unsupported Field Type: {unsupportedType}</strong>
          <div className="text-sm text-gray-600 mt-1">
            {field.question || data.title || data.name || 'No title'}
          </div>
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-white border border-gray-300 rounded text-sm unsupported-field-preview">
        <div className="text-xs text-gray-500 mb-2 font-semibold">Original Data Preview:</div>
        <div className="space-y-1 text-gray-700">
          {Object.entries(data).slice(0, 5).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return (
                <div key={key} className="truncate">
                  <span className="font-mono text-xs text-blue-600">{key}:</span>{' '}
                  <span className="text-gray-500 italic">{Array.isArray(value) ? '[Array]' : '{Object}'}</span>
                </div>
              );
            }
            return (
              <div key={key} className="truncate">
                <span className="font-mono text-xs text-blue-600">{key}:</span>{' '}
                <span className="text-gray-800">{String(value)}</span>
              </div>
            );
          })}
          {Object.keys(data).length > 5 && (
            <div className="text-xs text-gray-400 italic">... and {Object.keys(data).length - 5} more properties</div>
          )}
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="mt-3 px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm transition-colors"
      >
        {showDetails ? '▼ Hide' : '▶ Show'} Full Data
      </button>
      
      {showDetails && (
        <div className="unsupported-field-details mt-3">
          <div className="text-xs text-gray-600 mb-2 font-semibold">
            Full SurveyJS data for manual conversion:
          </div>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-[300px] border border-gray-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-600 italic">
        💡 This field type is not yet supported. Manual implementation required.
      </div>
    </div>
  );
}

export default UnsupportedField;
