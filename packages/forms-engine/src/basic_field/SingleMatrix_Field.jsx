import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import UnselectableRadio from "../helper_shared/UnselectableRadio";

const SingleMatrixField = React.memo(function SingleMatrixField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        const fieldId = field.id || f.id || 'matrix';
        
        if (isPreview) {
          const rows = f.rows || [];
          const columns = f.columns || [];
          const selected = f.selected || {};

          return (
            <div className={`singlematrix-field-preview ${insideSection ? "border-b border-gray-200" : "border-0"}`}>
              <div className="pb-4">
                <div className="font-light mb-3 break-words overflow-hidden">{f.question || "Question"}</div>
                
                {rows.length > 0 && columns.length > 0 ? (
                  <div className="singlematrix-field-grid space-y-1 border-t border-gray-200 pt-3">
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
          <div className="singlematrix-field-edit space-y-3">
            <input
              className="px-3 py-2 h-10 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div>
              <div className="text-sm font-semibold mb-2 text-gray-600">Rows</div>
              <div className="space-y-2">
                {(f.rows || []).map((row) => (
                  <div key={row.id} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors">
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => api.row.update(row.id, e.target.value)}
                      placeholder={placeholder?.rows || "Row text"}
                      className="flex-1 min-w-0 outline-none bg-transparent"
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
              {(f.rows || []).length >= 10 ? (
                <div className="mt-2 text-gray-500 text-sm">Max rows reached</div>
              ) : (
                <button
                  onClick={() => api.row.add(`Row ${(f.rows || []).length + 1}`)}
                  className="mt-2 w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <PLUSOPTION_ICON className="w-5 h-5" /> Add Row
                </button>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold mb-2 text-gray-600">Columns</div>
              <div className="space-y-2">
                {(f.columns || []).map((col) => (
                  <div key={col.id} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors">
                    <input
                      type="text"
                      value={col.value}
                      onChange={(e) => api.column.update(col.id, e.target.value)}
                      placeholder={placeholder?.columns || "Column text"}
                      className="flex-1 min-w-0 outline-none bg-transparent"
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
              {(f.columns || []).length >= 10 ? (
                <div className="mt-2 text-gray-500 text-sm">Max columns reached</div>
              ) : (
                <button
                  onClick={() => api.column.add(`Column ${(f.columns || []).length + 1}`)}
                  className="mt-2 w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <PLUSOPTION_ICON className="w-5 h-5" /> Add Column
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
