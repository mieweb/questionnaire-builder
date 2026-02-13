import { useState, useRef } from 'react';
import { QuestionnaireEditor } from '@mieweb/forms-editor';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';
import { PRESETS, PRESET_KEYS } from './presets';

export function InstanceCard({ instance, onRemove, onDuplicate, onUpdate, onReset }) {
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [isResponseOpen, setIsResponseOpen] = useState(false);
  const [schemaText, setSchemaText] = useState(JSON.stringify(instance.schema, null, 2));
  const [schemaError, setSchemaError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const rendererRef = useRef(null);
  const [response, setResponse] = useState(null);

  // Key for forcing remount
  const [mountKey, setMountKey] = useState(0);

  const handleSchemaChange = (e) => {
    const text = e.target.value;
    setSchemaText(text);
    try {
      const parsed = JSON.parse(text);
      setSchemaError(null);
      onUpdate(instance.id, { schema: parsed });
    } catch (err) {
      setSchemaError(err.message);
    }
  };

  const handleApplySchema = () => {
    if (!schemaError) {
      setMountKey((k) => k + 1);
      setResponse(null);
    }
  };

  const handleThemeChange = (e) => {
    onUpdate(instance.id, { theme: e.target.value });
  };

  const handlePresetChange = (e) => {
    const presetKey = e.target.value;
    if (presetKey && PRESETS[presetKey]) {
      const newSchema = JSON.parse(JSON.stringify(PRESETS[presetKey].schema));
      setSchemaText(JSON.stringify(newSchema, null, 2));
      setSchemaError(null);
      onUpdate(instance.id, { schema: newSchema, preset: presetKey });
      setMountKey((k) => k + 1);
    }
  };

  const handleGetResponse = () => {
    if (rendererRef.current) {
      const resp = rendererRef.current.getResponse();
      setResponse(resp);
      setIsResponseOpen(true);
      console.log('Playground getResponse:', resp);
    } else {
      console.warn('Renderer ref not available');
    }
  };

  const handleResetInstance = () => {
    setMountKey((k) => k + 1);
    setResponse(null);
    onReset(instance.id);
  };

  const typeLabel = instance.type === 'editor' ? 'Editor' : 'Renderer';
  const typeColor = instance.type === 'editor' ? 'bg-blue-500' : 'bg-green-500';

  return (
    <div className="playground-instance-card flex flex-col bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="playground-instance-header flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${typeColor}`}>
            {typeLabel}
          </span>
          <span className="text-sm font-medium text-slate-700">#{instance.id.split('-')[1]}</span>
          <span className="text-xs text-slate-400">Theme: {instance.theme}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="px-2 py-1 text-xs bg-slate-200 hover:bg-slate-300 rounded transition-colors"
            title="Toggle debug panel"
          >
            🐛
          </button>
          <button
            onClick={() => onDuplicate(instance)}
            className="px-2 py-1 text-xs bg-slate-200 hover:bg-slate-300 rounded transition-colors"
            title="Duplicate instance"
          >
            📋
          </button>
          <button
            onClick={handleResetInstance}
            className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 rounded transition-colors"
            title="Reset instance"
          >
            🔄
          </button>
          <button
            onClick={() => onRemove(instance.id)}
            className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors"
            title="Remove instance"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="playground-instance-controls flex flex-wrap items-center gap-3 px-4 py-3 bg-slate-50/50 border-b border-slate-100">
        <select
          id={`instance-${instance.id}-preset`}
          value={instance.preset || ''}
          onChange={handlePresetChange}
          className="px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
        >
          <option value="">Select preset...</option>
          {PRESET_KEYS.map((key) => (
            <option key={key} value={key}>
              {PRESETS[key].label}
            </option>
          ))}
        </select>
        <select
          id={`instance-${instance.id}-theme`}
          value={instance.theme}
          onChange={handleThemeChange}
          className="px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      {/* Schema Editor - Collapsible */}
      <div className="playground-schema-editor border-b border-slate-200">
        <button
          onClick={() => setIsSchemaOpen(!isSchemaOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors text-left"
        >
          <span className="text-xs font-semibold text-slate-700">📄 Schema Editor</span>
          <span className="text-xs text-slate-500">{isSchemaOpen ? '▲' : '▼'}</span>
        </button>
        {isSchemaOpen && (
          <div className="px-4 py-3 bg-slate-50">
            <textarea
              id={`instance-${instance.id}-schema`}
              value={schemaText}
              onChange={handleSchemaChange}
              className="w-full h-48 p-3 text-xs font-mono bg-white border border-slate-300 rounded-lg resize-y"
              spellCheck={false}
            />
            <div className="flex items-center justify-between mt-2">
              {schemaError ? (
                <p className="text-xs text-red-600">JSON Error: {schemaError}</p>
              ) : (
                <span />
              )}
              <button
                onClick={handleApplySchema}
                disabled={!!schemaError}
                className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Response Panel - Collapsible (only for renderer) */}
      {instance.type === 'renderer' && (
        <div className="playground-response-panel border-b border-green-200">
          <button
            onClick={() => setIsResponseOpen(!isResponseOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-green-50 hover:bg-green-100 transition-colors text-left"
          >
            <span className="text-xs font-semibold text-green-800">📋 Response Output</span>
            <span className="text-xs text-green-600">{isResponseOpen ? '▲' : '▼'}</span>
          </button>
          {isResponseOpen && (
            <div className="px-4 py-3 bg-green-50/50">
              <div className="flex items-center justify-end mb-2 gap-2">
                <button
                  onClick={handleGetResponse}
                  className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                >
                  Get Response
                </button>
                {response && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
                    }}
                    className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                  >
                    Copy
                  </button>
                )}
              </div>
              {response ? (
                <pre className="w-full h-48 p-3 text-xs font-mono bg-white border border-green-300 rounded-lg overflow-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              ) : (
                <div className="w-full h-24 flex items-center justify-center text-xs text-green-600 bg-white border border-green-300 rounded-lg">
                  Click &quot;Get Response&quot; to capture the current form state
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Debug Panel */}
      {showDebug && (
        <div className="playground-debug-panel px-4 py-3 bg-amber-50 border-b border-amber-200 text-xs">
          <div className="font-semibold text-amber-800 mb-2">Debug Info</div>
          <div className="space-y-1 text-amber-700">
            <div><strong>Instance ID:</strong> {instance.id}</div>
            <div><strong>Type:</strong> {instance.type}</div>
            <div><strong>Theme:</strong> {instance.theme}</div>
            <div><strong>Mount Key:</strong> {mountKey}</div>
            <div><strong>Schema Title:</strong> {instance.schema?.title || 'N/A'}</div>
            <div><strong>Field Count:</strong> {instance.schema?.fields?.length || 0}</div>
          </div>
        </div>
      )}

      {/* Component Container */}
      <div
        className="playground-instance-content flex-1 p-4 overflow-auto"
        style={{ minHeight: '300px', maxHeight: '600px' }}
      >
        {instance.type === 'editor' ? (
          <QuestionnaireEditor
            key={`${instance.id}-${mountKey}`}
            initialFormData={instance.schema}
            onChange={(data) => {
              onUpdate(instance.id, { schema: data });
              setSchemaText(JSON.stringify(data, null, 2));
            }}
            theme={instance.theme}
          />
        ) : (
          <QuestionnaireRenderer
            key={`${instance.id}-${mountKey}`}
            ref={rendererRef}
            formData={instance.schema}
            theme={instance.theme}
          />
        )}
      </div>
    </div>
  );
}
