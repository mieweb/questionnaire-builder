import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import UnselectableRadio from "../helper_shared/UnselectableRadio";

const SingleMatrixField = React.memo(function SingleMatrixField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f }) => {
        const fieldId = field.id || f.id || 'matrix';
        
        if (isPreview) {
          const rows = f.rows || [];
          const columns = f.columns || [];
          const selected = f.selected || {};

          return (
            <div className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="pb-4">
                <div className="font-light mb-3">{f.question || "Question"}</div>
                
                {rows.length > 0 && columns.length > 0 ? (
                  <div className="space-y-1 border-t border-gray-200 pt-3">
                    {/* Column Headers - Hidden on mobile */}
                    <div className="hidden lg:flex items-center gap-4 pl-32">
                      {columns.map((col) => (
                        <div key={col.id} className="flex-1 text-center font-normal">
                          {col.value}
                        </div>
                      ))}
                    </div>
                    
                    {/* Rows with Radio Buttons */}
                    {rows.map((row, rowIndex) => (
                      <div key={row.id} className="py-1 my-2">
                        <div className="lg:hidden font-semibold mb-2">{row.value}</div>
                        <div className="flex lg:flex-row flex-col items-start lg:items-center gap-4">
                          <div className="hidden lg:block w-32 font-normal">{row.value}</div>
                          {columns.map((col, colIndex) => {
                            const isSelected = selected[row.id] === col.id;
                            const inputId = `matrix-${fieldId}-${rowIndex}-${colIndex}`;
                            
                            return (
                              <div key={col.id} className="flex-1 flex lg:justify-center items-center gap-3">
                                <UnselectableRadio
                                  id={inputId}
                                  name={`matrix-${fieldId}-${row.id}`}
                                  value={col.id}
                                  checked={isSelected}
                                  onSelect={() => {
                                    // Rebuild selected in row order
                                    const updatedSelected = {};
                                    rows.forEach((r) => {
                                      if (r.id === row.id) {
                                        updatedSelected[r.id] = col.id;
                                      } else if (selected[r.id]) {
                                        updatedSelected[r.id] = selected[r.id];
                                      }
                                    });
                                    api.field.update("selected", updatedSelected);
                                  }}
                                  onUnselect={() => {
                                    // Rebuild selected in row order, excluding current row
                                    const updatedSelected = {};
                                    rows.forEach((r) => {
                                      if (r.id !== row.id && selected[r.id]) {
                                        updatedSelected[r.id] = selected[r.id];
                                      }
                                    });
                                    api.field.update("selected", updatedSelected);
                                  }}
                                  className="h-9 w-9 cursor-pointer flex-shrink-0"
                                />
                                <span className="lg:hidden">{col.value}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">
                    Configure rows and columns in edit mode
                  </div>
                )}
              </div>
            </div>
          );
        }

        return (
          <div>
            <input
              className="px-3 py-2 w-full border border-black/40 rounded mb-4"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder="Enter question"
            />

            <div className="mb-4">
              <div className="text-sm font-semibold mb-2">Rows</div>
              {(f.rows || []).map((row) => (
                <div key={row.id} className="flex items-center px-4 my-1.5 shadow border border-black/10 rounded-lg">
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => api.row.update(row.id, e.target.value)}
                    placeholder="Row text"
                    className="w-full py-2"
                  />
                  <button onClick={() => api.row.remove(row.id)}>
                    <TRASHCANTWO_ICON className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => api.row.add(`Row ${(f.rows || []).length + 1}`)}
                className="mt-2 ml-2 flex gap-3 justify-center"
              >
                <PLUSOPTION_ICON className="h-6 w-6" /> Add Row
              </button>
            </div>

            <div className="mb-4">
              <div className="text-sm font-semibold mb-2">Columns</div>
              {(f.columns || []).map((col) => (
                <div key={col.id} className="flex items-center px-4 my-1.5 shadow border border-black/10 rounded-lg">
                  <input
                    type="text"
                    value={col.value}
                    onChange={(e) => api.column.update(col.id, e.target.value)}
                    placeholder="Column text"
                    className="w-full py-2"
                  />
                  <button onClick={() => api.column.remove(col.id)}>
                    <TRASHCANTWO_ICON className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {(f.columns || []).length >= 10 ? (
                <div className="mt-2 ml-2 text-gray-500 text-sm">Max columns reached</div>
              ) : (
                <button
                  onClick={() => api.column.add(`Column ${(f.columns || []).length + 1}`)}
                  className="mt-2 ml-2 flex gap-3 justify-center"
                >
                  <PLUSOPTION_ICON className="h-6 w-6" /> Add Column
                </button>
              )}
            </div>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default SingleMatrixField;
