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
    <div className="mie:space-y-4">
      {/* Rows Section */}
      <div className="mie:space-y-3">
        <label className="mie:block mie:text-sm mie:font-medium mie:text-gray-700">Rows</label>
        <div ref={rowsContainerRef} className="mie:space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-gray-300 mie:rounded-lg mie:shadow-sm mie:hover:border-gray-400 mie:transition-colors">
              <input
                className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent"
                value={row.value}
                onChange={(e) => api.row.update(row.id, e.target.value)}
                placeholder="Row text"
              />
              <button
                onClick={() => api.row.remove(row.id)}
                className="mie:shrink-0 mie:text-gray-400 mie:hover:text-red-600 mie:transition-colors"
                title="Remove row"
              >
                <TRASHCANTWO_ICON className="mie:w-5 mie:h-5" />
              </button>
            </div>
          ))}
        </div>
        {rows.length >= 10 ? (
          <div className="mie:px-3 mie:py-2 mie:text-sm mie:text-gray-500 mie:text-center mie:bg-gray-50 mie:rounded-lg">Max rows reached (10)</div>
        ) : (
          <button
            onClick={() => api.row.add("")}
            className="mie:w-full mie:px-3 mie:py-2 mie:text-sm mie:font-medium mie:text-blue-600 mie:border mie:border-blue-300 mie:rounded-lg mie:hover:bg-blue-50 mie:transition-colors"
          >
            + Add Row
          </button>
        )}
      </div>

      {/* Columns Section */}
      <div className="mie:space-y-3">
        <label className="mie:block mie:text-sm mie:font-medium mie:text-gray-700">Columns</label>
        <div ref={colsContainerRef} className="mie:space-y-2">
          {columns.map((col) => (
            <div key={col.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-gray-300 mie:rounded-lg mie:shadow-sm mie:hover:border-gray-400 mie:transition-colors">
              <input
                className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent"
                value={col.value}
                onChange={(e) => api.column.update(col.id, e.target.value)}
                placeholder="Column text"
              />
              <button
                onClick={() => api.column.remove(col.id)}
                className="mie:shrink-0 mie:text-gray-400 mie:hover:text-red-600 mie:transition-colors"
                title="Remove column"
              >
                <TRASHCANTWO_ICON className="mie:w-5 mie:h-5" />
              </button>
            </div>
          ))}
        </div>
        {columns.length >= 10 ? (
          <div className="mie:px-3 mie:py-2 mie:text-sm mie:text-gray-500 mie:text-center mie:bg-gray-50 mie:rounded-lg">Max columns reached (10)</div>
        ) : (
          <button
            onClick={() => api.column.add("")}
            className="mie:w-full mie:px-3 mie:py-2 mie:text-sm mie:font-medium mie:text-blue-600 mie:border mie:border-blue-300 mie:rounded-lg mie:hover:bg-blue-50 mie:transition-colors"
          >
            + Add Column
          </button>
        )}
      </div>
    </div>
  );
}
