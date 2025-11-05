import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const MultiMatrixField = React.memo(function MultiMatrixField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f }) => {
        const fieldId = field.id || f.id || 'multimatrix';
        
        if (isPreview) {
          const rows = f.rows || [];
          const columns = f.columns || [];
          const selected = f.selected || {};

          const toggleSelection = (rowValue, colValue) => {
            const updatedSelected = {};
            rows.forEach((r) => {
              const currentSelections = selected[r.value] || [];
              if (r.value === rowValue) {
                // Toggle this column for this row
                if (currentSelections.includes(colValue)) {
                  updatedSelected[r.value] = currentSelections.filter(c => c !== colValue);
                } else {
                  updatedSelected[r.value] = [...currentSelections, colValue];
                }
              } else if (currentSelections.length > 0) {
                updatedSelected[r.value] = currentSelections;
              }
            });
            api.field.update("selected", updatedSelected);
          };

          return (
            <div className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="pb-4">
                <div className="font-light mb-3">{f.question || "Question"}</div>
                
                {rows.length > 0 && columns.length > 0 ? (
                  <div className="space-y-1 border-t border-gray-200 pt-3">
                    {/* Column Headers - Hidden on mobile */}
                    <div className="hidden lg:flex items-center gap-4 pl-32">
                      {columns.map((col, colIndex) => (
                        <div key={colIndex} className="flex-1 text-center font-normal">
                          {col.value}
                        </div>
                      ))}
                    </div>
                    
                    {/* Rows with Checkboxes */}
                    {rows.map((row, rowIndex) => {
                      const rowSelections = selected[row.value] || [];
                      
                      return (
                        <div key={rowIndex} className="py-1 my-2">
                          <div className="lg:hidden font-semibold mb-2">{row.value}</div>
                          <div className="flex lg:flex-row flex-col items-start lg:items-center gap-4">
                            <div className="hidden lg:block w-32 font-normal">{row.value}</div>
                            {columns.map((col, colIndex) => {
                              const isChecked = rowSelections.includes(col.value);
                              const inputId = `multimatrix-${fieldId}-${rowIndex}-${colIndex}`;
                              
                              return (
                                <div key={colIndex} className="flex-1 flex lg:justify-center items-center gap-3">
                                  <input
                                    type="checkbox"
                                    id={inputId}
                                    checked={isChecked}
                                    onChange={() => toggleSelection(row.value, col.value)}
                                    className="h-9 w-9 cursor-pointer flex-shrink-0"
                                  />
                                  <label htmlFor={inputId} className="lg:hidden cursor-pointer">
                                    {col.value}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
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
              {(f.rows || []).map((row, index) => (
                <div key={index} className="flex items-center px-4 my-1.5 shadow border border-black/10 rounded-lg">
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => {
                      const updatedRows = f.rows.map((r, i) => 
                        i === index ? { value: e.target.value } : r
                      );
                      api.field.update("rows", updatedRows);
                    }}
                    placeholder="Row text"
                    className="w-full py-2"
                  />
                  <button onClick={() => {
                    const updatedRows = f.rows.filter((r, i) => i !== index);
                    api.field.update("rows", updatedRows);
                  }}>
                    <TRASHCANTWO_ICON className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newRow = { value: `Row ${(f.rows || []).length + 1}` };
                  api.field.update("rows", [...(f.rows || []), newRow]);
                }}
                className="mt-2 ml-2 flex gap-3 justify-center"
              >
                <PLUSOPTION_ICON className="h-6 w-6" /> Add Row
              </button>
            </div>

            <div className="mb-4">
              <div className="text-sm font-semibold mb-2">Columns</div>
              {(f.columns || []).map((col, index) => (
                <div key={index} className="flex items-center px-4 my-1.5 shadow border border-black/10 rounded-lg">
                  <input
                    type="text"
                    value={col.value}
                    onChange={(e) => {
                      const updatedColumns = f.columns.map((c, i) => 
                        i === index ? { value: e.target.value } : c
                      );
                      api.field.update("columns", updatedColumns);
                    }}
                    placeholder="Column text"
                    className="w-full py-2"
                  />
                  <button onClick={() => {
                    const updatedColumns = f.columns.filter((c, i) => i !== index);
                    api.field.update("columns", updatedColumns);
                  }}>
                    <TRASHCANTWO_ICON className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {(f.columns || []).length >= 10 ? (
                <div className="mt-2 ml-2 text-gray-500 text-sm">Max columns reached</div>
              ) : (
                <button
                  onClick={() => {
                    const newCol = { value: `Column ${(f.columns || []).length + 1}` };
                    api.field.update("columns", [...(f.columns || []), newCol]);
                  }}
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

export default MultiMatrixField;
