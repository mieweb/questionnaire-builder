import React, { useState, useEffect } from 'react';

export function CollisionDetector({ instances }) {
  const [collisions, setCollisions] = useState({ ids: [], warnings: [] });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check for DOM ID collisions
    const checkCollisions = () => {
      const allIds = document.querySelectorAll('[id]');
      const idCounts = {};
      const duplicates = [];

      allIds.forEach((el) => {
        if (el.id) {
          idCounts[el.id] = (idCounts[el.id] || 0) + 1;
        }
      });

      Object.entries(idCounts).forEach(([id, count]) => {
        if (count > 1) {
          duplicates.push({ id, count });
        }
      });

      const warnings = [];
      if (duplicates.length > 0) {
        warnings.push(`Found ${duplicates.length} duplicate DOM IDs`);
      }

      setCollisions({ ids: duplicates.slice(0, 20), warnings });
    };

    const timer = setTimeout(checkCollisions, 500);
    return () => clearTimeout(timer);
  }, [instances]);

  const hasCollisions = collisions.ids.length > 0;

  return (
    <div
      className={`collision-detector rounded-lg border ${
        hasCollisions ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium ${
          hasCollisions ? 'text-red-700' : 'text-green-700'
        }`}
      >
        <span>
          {hasCollisions
            ? `⚠️ ${collisions.ids.length} duplicate ID${collisions.ids.length > 1 ? 's' : ''} detected`
            : '✅ No ID collisions detected'}
        </span>
        <span className="text-xs">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && hasCollisions && (
        <div className="px-4 pb-3 border-t border-red-200">
          <div className="pt-3">
            {collisions.warnings.map((w, i) => (
              <div key={i} className="text-sm text-red-600 mb-2">{w}</div>
            ))}
            <div className="text-xs font-medium text-red-600 mb-1">Duplicate IDs:</div>
            <div className="flex flex-wrap gap-1">
              {collisions.ids.map(({ id, count }) => (
                <span
                  key={id}
                  className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded"
                >
                  {id} (×{count})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
