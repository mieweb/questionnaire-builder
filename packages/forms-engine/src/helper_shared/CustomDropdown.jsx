import React, { useState, useRef, useEffect } from "react";

const CustomDropdown = function CustomDropdown({
  options = [],
  value = null,
  onChange = () => {},
  placeholder = "Select an option",
  showClearOption = true,
  maxHeight = "max-h-60",
  isMulti = false,
  disabled = false,
}) {
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

  const selectedIds = isMulti && Array.isArray(value) ? value : [];
  const selectedOptions = options.filter((opt) =>
    isMulti ? selectedIds.includes(opt.id) : opt.id === value
  );
  const availableOptions = isMulti
    ? options.filter((opt) => !selectedIds.includes(opt.id))
    : options;

  const handleSelect = (optionId) => {
    if (isMulti) {
      const newSelected = selectedIds.includes(optionId)
        ? selectedIds.filter((id) => id !== optionId)
        : [...selectedIds, optionId];
      onChange(newSelected);
    } else {
      onChange(optionId);
      setIsOpen(false);
    }
  };

  const handleRemove = (optionId) => {
    if (isMulti) {
      const newSelected = selectedIds.filter((id) => id !== optionId);
      onChange(newSelected);
    }
  };

  // For multi-select, show display
  if (isMulti) {
    return (
      <div ref={dropdownRef} className="custom-dropdown custom-dropdown-multi relative w-full overflow-visible">
        {/* Selected items display as pills */}
        <div
          className={`custom-dropdown-trigger w-full min-h-10 px-3 py-2 shadow border border-gray-300 rounded-lg cursor-pointer bg-white flex flex-wrap gap-2 items-center hover:border-blue-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors ${
            disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200" : ""
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.id}
                className="custom-dropdown-selected-pill inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                {option.value}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option.id);
                  }}
                  className="custom-dropdown-remove-btn hover:bg-blue-700 rounded"
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
            className={`w-5 h-5 ml-auto transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown menu */}
        {isOpen && availableOptions.length > 0 && (
          <div
            className={`custom-dropdown-menu absolute z-9999 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg ${maxHeight} overflow-y-auto`}
          >
            {availableOptions.map((option) => (
              <div
                key={option.id}
                className="custom-dropdown-option px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => handleSelect(option.id)}
              >
                {option.value}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Single select display
  const selectedOption = options.find((opt) => opt.id === value);
  return (
    <div ref={dropdownRef} className="custom-dropdown custom-dropdown-single-container relative w-full overflow-visible">
      {/* Dropdown trigger button */}
      <div
        className={`custom-dropdown-trigger w-full px-4 py-2 h-10 shadow border border-gray-300 rounded-lg cursor-pointer bg-white flex items-center justify-between hover:border-blue-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`custom-dropdown-value-text truncate min-w-0 ${selectedOption ? "text-gray-900" : "text-gray-400"}`}>
          {selectedOption ? selectedOption.value : placeholder}
        </span>

        {/* Dropdown arrow */}
        <svg
          className={`custom-dropdown-arrow w-5 h-5 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown menu */}
      {isOpen && options.length > 0 && (
        <div
          className={`custom-dropdown-menu absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg ${maxHeight} overflow-y-auto`}
        >
          {showClearOption && (
            <div
              className="custom-dropdown-clear-option px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
            >
              Clear selection
            </div>
          )}
          {options.map((option) => (
            <div
              key={option.id}
              className={`custom-dropdown-option px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                value === option.id ? "bg-blue-100 text-blue-900" : ""
              }`}
              onClick={() => handleSelect(option.id)}
            >
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
