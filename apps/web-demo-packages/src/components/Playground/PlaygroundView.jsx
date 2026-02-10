import React, { useState, useCallback } from 'react';
import { MenuDropdown } from '../Shared';
import { PRESETS } from './presets';
import { InstanceCard } from './InstanceCard';
import { CollisionDetector } from './CollisionDetector';

// Generate unique instance IDs
let instanceCounter = 0;
const generateId = () => `instance-${++instanceCounter}`;

export function PlaygroundView() {
  const [instances, setInstances] = useState([]);
  const [showCollisionDetector, setShowCollisionDetector] = useState(true);

  const addInstance = useCallback((type) => {
    const id = generateId();
    setInstances((prev) => [
      ...prev,
      {
        id,
        type,
        theme: 'light',
        preset: 'simple',
        schema: JSON.parse(JSON.stringify(PRESETS.simple.schema)),
      },
    ]);
  }, []);

  const removeInstance = useCallback((id) => {
    setInstances((prev) => prev.filter((inst) => inst.id !== id));
  }, []);

  const duplicateInstance = useCallback((instance) => {
    const id = generateId();
    setInstances((prev) => [
      ...prev,
      {
        ...instance,
        id,
        schema: JSON.parse(JSON.stringify(instance.schema)),
      },
    ]);
  }, []);

  const updateInstance = useCallback((id, updates) => {
    setInstances((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, ...updates } : inst))
    );
  }, []);

  const resetInstance = useCallback((id) => {
    setInstances((prev) =>
      prev.map((inst) => {
        if (inst.id !== id) return inst;
        const presetKey = inst.preset || 'simple';
        return {
          ...inst,
          schema: JSON.parse(JSON.stringify(PRESETS[presetKey]?.schema || PRESETS.simple.schema)),
        };
      })
    );
  }, []);

  const resetAll = useCallback(() => {
    setInstances([]);
    instanceCounter = 0;
  }, []);

  return (
    <div className="playground-view min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <MenuDropdown />

      {/* Header */}
      <div className="playground-header sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">🧪 Playground</h1>
              <p className="text-sm text-slate-500 mt-1">
                Test multiple Editor/Renderer instances for isolation bugs
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => addInstance('editor')}
                className="px-4 py-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
              >
                + Add Editor
              </button>
              <button
                onClick={() => addInstance('renderer')}
                className="px-4 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-sm"
              >
                + Add Renderer
              </button>
              <button
                onClick={resetAll}
                className="px-4 py-2 text-sm font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
              >
                Reset All
              </button>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  id="playground-collision-detector"
                  type="checkbox"
                  checked={showCollisionDetector}
                  onChange={(e) => setShowCollisionDetector(e.target.checked)}
                  className="rounded"
                />
                Collision Detector
              </label>
            </div>
          </div>

          {/* Collision Detector */}
          {showCollisionDetector && instances.length > 0 && (
            <div className="mt-4">
              <CollisionDetector instances={instances} />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {instances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🧪</div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No instances yet</h2>
            <p className="text-slate-500 mb-6 max-w-md">
              Add Editor or Renderer instances to test multi-instance scenarios like state isolation,
              DOM ID collisions, and theme conflicts.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => addInstance('editor')}
                className="px-6 py-3 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors shadow-md"
              >
                + Add Editor
              </button>
              <button
                onClick={() => addInstance('renderer')}
                className="px-6 py-3 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors shadow-md"
              >
                + Add Renderer
              </button>
            </div>
          </div>
        ) : (
          <div className="playground-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
            {instances.map((instance) => (
              <InstanceCard
                key={instance.id}
                instance={instance}
                onRemove={removeInstance}
                onDuplicate={duplicateInstance}
                onUpdate={updateInstance}
                onReset={resetInstance}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {instances.length > 0 && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-lg border border-slate-200 text-sm text-slate-600">
          {instances.filter((i) => i.type === 'editor').length} Editors •{' '}
          {instances.filter((i) => i.type === 'renderer').length} Renderers
        </div>
      )}
    </div>
  );
}
