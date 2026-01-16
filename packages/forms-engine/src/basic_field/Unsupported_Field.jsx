import React from 'react';

function UnsupportedField({ field }) {
  const [showDetails, setShowDetails] = React.useState(false);
  
  const unsupportedType = field.unsupportedType || 'unknown';
  const data = field.unsupportedData || field._sourceData || {};
  
  return (
    <div className="unsupported-field-container mie:border-2 mie:border-dashed mie:border-orange-500 mie:rounded-lg mie:p-4 mie:bg-orange-50 mie:mb-4">
      <div className="unsupported-field-header mie:flex mie:items-center mie:gap-2 mie:mb-2">
        <span className="mie:text-xl">⚠️</span>
        <div className="mie:flex-1">
          <strong className="mie:text-orange-700">Unsupported Field Type: {unsupportedType}</strong>
          <div className="mie:text-sm mie:text-mietextmuted mie:mt-1">
            {field.question || data.title || data.name || 'No title'}
          </div>
        </div>
      </div>
      
      <div className="mie:mt-3 mie:p-3 mie:bg-miesurface mie:border mie:border-mieborder mie:rounded mie:text-sm unsupported-field-preview">
        <div className="mie:text-xs mie:text-mietextmuted mie:mb-2 mie:font-semibold">Original Data Preview:</div>
        <div className="mie:space-y-1 mie:text-mietext">
          {Object.entries(data).slice(0, 5).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return (
                <div key={key} className="mie:truncate">
                  <span className="mie:font-mono mie:text-xs mie:text-mieprimary">{key}:</span>{' '}
                  <span className="mie:text-mietextmuted mie:italic">{Array.isArray(value) ? '[Array]' : '{Object}'}</span>
                </div>
              );
            }
            return (
              <div key={key} className="mie:truncate">
                <span className="mie:font-mono mie:text-xs mie:text-mieprimary">{key}:</span>{' '}
                <span className="mie:text-mietext">{String(value)}</span>
              </div>
            );
          })}
          {Object.keys(data).length > 5 && (
            <div className="mie:text-xs mie:text-mietextmuted mie:italic">... and {Object.keys(data).length - 5} more properties</div>
          )}
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="mie:mt-3 mie:px-3 mie:py-1.5 mie:bg-orange-500 mie:text-white mie:rounded mie:hover:bg-orange-600 mie:text-sm mie:transition-colors mie:border-0 mie:outline-none mie:focus:outline-none"
      >
        {showDetails ? '▼ Hide' : '▶ Show'} Full Data
      </button>
      
      {showDetails && (
        <div className="unsupported-field-details mie:mt-3">
          <div className="mie:text-xs mie:text-mietextmuted mie:mb-2 mie:font-semibold">
            Full SurveyJS data for manual conversion:
          </div>
          <pre className="mie:bg-miebackground mie:p-3 mie:rounded mie:text-xs mie:overflow-auto mie:max-h-75 mie:border mie:border-mieborder">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mie:mt-3 mie:text-xs mie:text-mietextmuted mie:italic">
        💡 This field type is not yet supported. Manual implementation required.
      </div>
    </div>
  );
}

export default UnsupportedField;
