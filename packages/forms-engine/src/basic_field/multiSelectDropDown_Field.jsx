import React, { useState, useRef, useEffect } from "react";
import { PLUSOPTION_ICON, TRASHCANTWO_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const MultiSelectDropDownField = React.memo(function MultiSelectDropDownField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        const selectedIds = Array.isArray(f.selected) ? f.selected : [];
        const selectedOptions = (f.options || []).filter(opt => selectedIds.includes(opt.id));
        const availableOptions = (f.options || []).filter(opt => !selectedIds.includes(opt.id));

        const handleRemoveSelection = (optionId) => {
          api.selection.multiToggle(optionId);
        };

        const handleSelectOption = (optionId) => {
          api.selection.multiToggle(optionId);
        };

        if (isPreview) {
          return (
            <div className={`multiselect-dropdown-preview ${insideSection ? "border-b border-gray-200" : "border-0"}`}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
                <div className="font-light">{f.question || "Question"}</div>
                <div ref={dropdownRef} className="multiselect-dropdown-field relative">
                  {/* Selected items display as pills */}
                  <div
                    className="multiselect-dropdown-selection w-full min-h-10 px-3 py-2 shadow border border-gray-300 rounded-lg cursor-pointer bg-white flex flex-wrap gap-2 items-center hover:border-blue-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {selectedOptions.length === 0 ? (
                      <span className="text-gray-400">Select an option</span>
                    ) : (
                      selectedOptions.map((option) => (
                        <span
                          key={option.id}
                          className="multiselect-dropdown-pill inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                          {option.value}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSelection(option.id);
                            }}
                            className="hover:bg-blue-700 rounded"
                            aria-label={`Remove ${option.value}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))
                    )}
                    
                    {/* Dropdown arrow */}
                    <svg 
                      className={`w-5 h-5 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Dropdown menu */}
                  {isOpen && availableOptions.length > 0 && (
                    <div className="multiselect-dropdown-menu absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {availableOptions.map((option) => (
                        <div
                          key={option.id}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => {
                            handleSelectOption(option.id);
                          }}
                        >
                          {option.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }

        // ────────── Edit Mode ──────────
        return (
          <div className="multiselect-dropdown-edit space-y-3">
            <input
              className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="w-full min-h-10 px-4 py-2 shadow border border-gray-300 rounded-lg bg-gray-50 flex flex-wrap gap-2 items-center">
              <span className="text-gray-400 text-sm">Multi-select dropdown (Preview mode only)</span>
            </div>

            <div className="space-y-2">
              {(f.options || []).map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors"
                >
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => api.option.update(option.id, e.target.value)}
                    placeholder={placeholder?.options || "Option text"}
                    className="flex-1 min-w-0 outline-none bg-transparent"
                  />
                  <button 
                    onClick={() => api.option.remove(option.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove option"
                  >
                    <TRASHCANTWO_ICON className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => api.option.add()} 
              className="w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <PLUSOPTION_ICON className="w-5 h-5" /> Add Option
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default MultiSelectDropDownField;
