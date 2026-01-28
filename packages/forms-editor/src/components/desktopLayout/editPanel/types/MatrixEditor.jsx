import React from "react";
import { TRASHCANTWO_ICON, useInstanceId } from "@mieweb/forms-engine";

export default function MatrixEditor({ field, api }) {
  const instanceId = useInstanceId();
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
        <span className="mie:block mie:text-sm mie:font-medium mie:text-mietext">Rows</span>
        <div ref={rowsContainerRef} className="mie:space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:rounded-lg mie:shadow-sm mie:hover:border-mieprimary/50 mie:transition-colors">
              <input
                id={`${instanceId}-editor-matrix-row-${field.id}-${row.id}`}
                aria-label={`Row ${row.id}`}
                className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent mie:text-mietext mie:placeholder:text-mietextmuted"
                value={row.value}
                onChange={(e) => api.row.update(row.id, e.target.value)}
                placeholder="Row text"
              />
              <button
                onClick={() => api.row.remove(row.id)}
                className="mie:shrink-0 mie:bg-transparent mie:text-mietextmuted/70 mie:hover:text-miedanger mie:transition-colors"
                title="Remove row"
              >
                <TRASHCANTWO_ICON className="mie:w-5 mie:h-5" />
              </button>
            </div>
          ))}
        </div>
        {rows.length >= 10 ? (
          <div className="mie:px-3 mie:py-2 mie:text-sm mie:text-mietextmuted mie:text-center mie:bg-miebackground mie:rounded-lg">Max rows reached (10)</div>
        ) : (
          <button
            onClick={() => api.row.add("")}
            className="mie:w-full mie:px-3 mie:py-2 mie:text-sm mie:font-medium mie:bg-miesurface mie:text-mieprimary mie:border mie:border-mieprimary/50 mie:rounded-lg mie:hover:bg-mieprimary/10 mie:transition-colors"
          >
            + Add Row
          </button>
        )}
      </div>

      {/* Columns Section */}
      <div className="mie:space-y-3">
        <span className="mie:block mie:text-sm mie:font-medium mie:text-mietext">Columns</span>
        <div ref={colsContainerRef} className="mie:space-y-2">
          {columns.map((col) => (
            <div key={col.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:rounded-lg mie:shadow-sm mie:hover:border-mieprimary/50 mie:transition-colors">
              <input
                id={`${instanceId}-editor-matrix-col-${field.id}-${col.id}`}
                aria-label={`Column ${col.id}`}
                className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent mie:text-mietext mie:placeholder:text-mietextmuted"
                value={col.value}
                onChange={(e) => api.column.update(col.id, e.target.value)}
                placeholder="Column text"
              />
              <button
                onClick={() => api.column.remove(col.id)}
                className="mie:shrink-0 mie:bg-transparent mie:text-mietextmuted/70 mie:hover:text-miedanger mie:transition-colors"
                title="Remove column"
              >
                <TRASHCANTWO_ICON className="mie:w-5 mie:h-5" />
              </button>
            </div>
          ))}
        </div>
        {columns.length >= 10 ? (
          <div className="mie:px-3 mie:py-2 mie:text-sm mie:text-mietextmuted mie:text-center mie:bg-miebackground mie:rounded-lg">Max columns reached (10)</div>
        ) : (
          <button
            onClick={() => api.column.add("")}
            className="mie:w-full mie:px-3 mie:py-2 mie:text-sm mie:font-medium mie:bg-miesurface mie:text-mieprimary mie:border mie:border-mieprimary/50 mie:rounded-lg mie:hover:bg-mieprimary/10 mie:transition-colors"
          >
            + Add Column
          </button>
        )}
      </div>
    </div>
  );
}
