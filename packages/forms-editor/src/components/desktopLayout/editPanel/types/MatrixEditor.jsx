import React from "react";

export default function MatrixEditor({ field, api }) {
  const rows = field.rows || [];
  const columns = field.columns || [];

  return (
    <div className="mt-3 space-y-4">
      {/* Rows Section */}
      <div>
        <div className="text-sm font-medium mb-1">Rows</div>
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-2 mb-2">
            <input
              className="flex-1 px-3 py-2 border border-black/20 rounded"
              value={row.value}
              onChange={(e) => api.row.update(row.id, e.target.value)}
              placeholder="Row text"
            />
            <button
              onClick={() => api.row.remove(row.id)}
              className="px-2 py-1 text-sm border border-black/20 rounded hover:bg-slate-50"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => api.row.add("")}
          className="mt-1 px-3 py-2 text-sm border border-black/20 rounded hover:bg-slate-50"
        >
          + Add Row
        </button>
      </div>

      {/* Columns Section */}
      <div>
        <div className="text-sm font-medium mb-1">Columns</div>
        {columns.map((col) => (
          <div key={col.id} className="flex items-center gap-2 mb-2">
            <input
              className="flex-1 px-3 py-2 border border-black/20 rounded"
              value={col.value}
              onChange={(e) => api.column.update(col.id, e.target.value)}
              placeholder="Column text"
            />
            <button
              onClick={() => api.column.remove(col.id)}
              className="px-2 py-1 text-sm border border-black/20 rounded hover:bg-slate-50"
            >
              Remove
            </button>
          </div>
        ))}
        {columns.length >= 10 ? (
          <div className="mt-1 px-3 py-2 text-sm text-gray-500">Max columns reached</div>
        ) : (
          <button
            onClick={() => api.column.add("")}
            className="mt-1 px-3 py-2 text-sm border border-black/20 rounded hover:bg-slate-50"
          >
            + Add Column
          </button>
        )}
      </div>
    </div>
  );
}
