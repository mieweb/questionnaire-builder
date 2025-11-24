import React from "react";
import { TRASHCANTWO_ICON } from "@mieweb/forms-engine";

export default function MatrixEditor({ field, api }) {
  const rows = field.rows || [];
  const columns = field.columns || [];
  const rowsContainerRef = React.useRef(null);
  const colsContainerRef = React.useRef(null);
  const prevRowCountRef = React.useRef(rows.length);
  const prevColCountRef = React.useRef(columns.length);

  // Auto-scroll when new row is added
  React.useEffect(() => {
    if (rows.length > prevRowCountRef.current && rowsContainerRef.current) {
      const lastChild = rowsContainerRef.current.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
    prevRowCountRef.current = rows.length;
  }, [rows.length]);

  // Auto-scroll when new column is added
  React.useEffect(() => {
    if (columns.length > prevColCountRef.current && colsContainerRef.current) {
      const lastChild = colsContainerRef.current.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
    prevColCountRef.current = columns.length;
  }, [columns.length]);

  return (
    <div className="space-y-4">
      {/* Rows Section */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Rows</label>
        <div ref={rowsContainerRef} className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors">
              <input
                className="flex-1 min-w-0 outline-none bg-transparent"
                value={row.value}
                onChange={(e) => api.row.update(row.id, e.target.value)}
                placeholder="Row text"
              />
              <button
                onClick={() => api.row.remove(row.id)}
                className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove row"
              >
                <TRASHCANTWO_ICON className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        {rows.length >= 10 ? (
          <div className="px-3 py-2 text-sm text-gray-500 text-center bg-gray-50 rounded-lg">Max rows reached (10)</div>
        ) : (
          <button
            onClick={() => api.row.add("")}
            className="w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            + Add Row
          </button>
        )}
      </div>

      {/* Columns Section */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Columns</label>
        <div ref={colsContainerRef} className="space-y-2">
          {columns.map((col) => (
            <div key={col.id} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors">
              <input
                className="flex-1 min-w-0 outline-none bg-transparent"
                value={col.value}
                onChange={(e) => api.column.update(col.id, e.target.value)}
                placeholder="Column text"
              />
              <button
                onClick={() => api.column.remove(col.id)}
                className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove column"
              >
                <TRASHCANTWO_ICON className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        {columns.length >= 10 ? (
          <div className="px-3 py-2 text-sm text-gray-500 text-center bg-gray-50 rounded-lg">Max columns reached (10)</div>
        ) : (
          <button
            onClick={() => api.column.add("")}
            className="w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            + Add Column
          </button>
        )}
      </div>
    </div>
  );
}
