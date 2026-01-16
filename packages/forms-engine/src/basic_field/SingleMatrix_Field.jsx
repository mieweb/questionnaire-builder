import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import UnselectableRadio from "../helper_shared/UnselectableRadio";

const SingleMatrixField = React.memo(function SingleMatrixField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f, placeholder }) => {
        const fieldId = field.id || f.id || 'matrix';
        
        if (isPreview) {
          const rows = f.rows || [];
          const columns = f.columns || [];
          const selected = f.selected || {};

          return (
            <div className="singlematrix-field-preview mie:text-mietext">
              <div className="mie:pb-4">
                <div className="mie:font-light mie:mb-3 mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
                
                {rows.length > 0 && columns.length > 0 ? (
                  <div className="singlematrix-field-grid mie:space-y-1 mie:border-t mie:border-mieborder mie:pt-3">
                    {/* Column Headers - Hidden on mobile */}
                    <div className="mie:hidden mie:lg:flex mie:items-center mie:gap-4 mie:pl-32">
                      {columns.map((col) => (
                        <div key={col.id} className="mie:flex-1 mie:text-center mie:font-normal mie:text-mietext">
                          {col.value}
                        </div>
                      ))}
                    </div>
                    
                    {/* Rows with Radio Buttons */}
                    {rows.map((row, rowIndex) => (
                      <div key={row.id} className="mie:py-1 mie:my-2">
                        <div className="mie:lg:hidden mie:font-semibold mie:mb-2 mie:text-mietext">{row.value}</div>
                        <div className="mie:flex mie:lg:flex-row mie:flex-col mie:items-start mie:lg:items-center mie:gap-4">
                          <div className="mie:hidden mie:lg:block mie:w-32 mie:font-normal mie:text-mietext">{row.value}</div>
                          {columns.map((col, colIndex) => {
                            const isSelected = selected[row.id] === col.id;
                            const inputId = `matrix-${fieldId}-${rowIndex}-${colIndex}`;
                            
                            return (
                              <div key={col.id} className="mie:flex-1 mie:flex mie:lg:justify-center mie:items-center mie:gap-3">
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
                                  className="mie:h-9 mie:w-9 mie:cursor-pointer mie:shrink-0 mie:accent-mieprimary mie:bg-miesurface"
                                />
                                <span className="mie:lg:hidden">{col.value}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mie:text-mietextmuted mie:text-sm">
                    Configure rows and columns in edit mode
                  </div>
                )}
              </div>
            </div>
          );
        }

        return (
          <div className="singlematrix-field-edit mie:space-y-3">
            <input
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div>
              <div className="mie:text-sm mie:font-semibold mie:mb-2 mie:text-mietextmuted">Rows</div>
              <div className="mie:space-y-2">
                {(f.rows || []).map((row) => (
                  <div key={row.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:rounded-lg mie:shadow-sm mie:hover:border-mietextmuted mie:transition-colors">
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => api.row.update(row.id, e.target.value)}
                      placeholder={placeholder?.rows || "Row text"}
                      className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent mie:text-mietext"
                    />
                    <button 
                      onClick={() => api.row.remove(row.id)}
                      className="mie:shrink-0 mie:text-mietextmuted mie:hover:text-miedanger mie:transition-colors mie:bg-transparent mie:border-0 mie:outline-none mie:focus:outline-none"
                      title="Remove row"
                    >
                      <TRASHCANTWO_ICON className="mie:w-5 mie:h-5" />
                    </button>
                  </div>
                ))}
              </div>
              {(f.rows || []).length >= 10 ? (
                <div className="mie:mt-2 mie:text-mietextmuted mie:text-sm">Max rows reached</div>
              ) : (
                <button
                  onClick={() => api.row.add(`Row ${(f.rows || []).length + 1}`)}
                  className="mie:mt-2 mie:w-full mie:px-3 mie:py-2 mie:text-sm mie:font-medium mie:text-mieprimary mie:border mie:border-mieprimary/50 mie:rounded-lg mie:bg-miesurface mie:hover:bg-mieprimary/10 mie:transition-colors mie:flex mie:items-center mie:justify-center mie:gap-2"
                >
                  <PLUSOPTION_ICON className="mie:w-5 mie:h-5" /> Add Row
                </button>
              )}
            </div>

            <div>
              <div className="mie:text-sm mie:font-semibold mie:mb-2 mie:text-mietextmuted">Columns</div>
              <div className="mie:space-y-2">
                {(f.columns || []).map((col) => (
                  <div key={col.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:rounded-lg mie:shadow-sm mie:hover:border-mietextmuted mie:transition-colors">
                    <input
                      type="text"
                      value={col.value}
                      onChange={(e) => api.column.update(col.id, e.target.value)}
                      placeholder={placeholder?.columns || "Column text"}
                      className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent mie:text-mietext"
                    />
                    <button 
                      onClick={() => api.column.remove(col.id)}
                      className="mie:shrink-0 mie:text-mietextmuted mie:hover:text-miedanger mie:transition-colors mie:bg-transparent mie:border-0 mie:outline-none mie:focus:outline-none"
                      title="Remove column"
                    >
                      <TRASHCANTWO_ICON className="mie:w-5 mie:h-5" />
                    </button>
                  </div>
                ))}
              </div>
              {(f.columns || []).length >= 10 ? (
                <div className="mie:mt-2 mie:text-mietextmuted mie:text-sm">Max columns reached</div>
              ) : (
                <button
                  onClick={() => api.column.add(`Column ${(f.columns || []).length + 1}`)}
                  className="mie:mt-2 mie:w-full mie:px-3 mie:py-2 mie:text-sm mie:font-medium mie:text-mieprimary mie:border mie:border-mieprimary/50 mie:rounded-lg mie:bg-miesurface mie:hover:bg-mieprimary/10 mie:transition-colors mie:flex mie:items-center mie:justify-center mie:gap-2"
                >
                  <PLUSOPTION_ICON className="mie:w-5 mie:h-5" /> Add Column
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
