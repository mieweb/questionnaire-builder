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
      <div ref={dropdownRef} className="custom-dropdown custom-dropdown-multi mie:relative mie:w-full mie:overflow-visible">
        {/* Selected items display as pills */}
        <div
          className={`custom-dropdown-trigger mie:w-full mie:min-h-10 mie:px-3 mie:py-2 mie:shadow mie:border mie:border-gray-300 mie:rounded-lg mie:cursor-pointer mie:bg-white mie:flex mie:flex-wrap mie:gap-2 mie:items-center mie:hover:border-blue-300 mie:focus:border-blue-400 mie:focus:ring-1 mie:focus:ring-blue-400 mie:transition-colors ${
            disabled ? "mie:opacity-50 mie:cursor-not-allowed mie:bg-gray-50 mie:border-gray-200" : ""
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {selectedOptions.length === 0 ? (
            <span className="mie:text-gray-400">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.id}
                className="custom-dropdown-selected-pill mie:inline-flex mie:items-center mie:gap-1 mie:px-3 mie:py-1 mie:bg-blue-600 mie:text-white mie:rounded mie:text-sm"
              >
                {option.value}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option.id);
                  }}
                  className="custom-dropdown-remove-btn mie:hover:bg-blue-700 mie:rounded"
                  aria-label={`Remove ${option.value}`}
                >
                  <svg className="mie:w-4 mie:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))
          )}

          {/* Dropdown arrow */}
          <svg
            className={`mie:w-5 mie:h-5 mie:ml-auto mie:transition-transform mie:shrink-0 ${isOpen ? "mie:rotate-180" : ""}`}
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
            className={`custom-dropdown-menu mie:absolute mie:z-9999 mie:w-full mie:mt-1 mie:bg-white mie:border mie:border-gray-200 mie:rounded-lg mie:shadow-lg ${maxHeight} mie:overflow-y-auto`}
          >
            {availableOptions.map((option) => (
              <div
                key={option.id}
                className="custom-dropdown-option mie:px-4 mie:py-2 mie:hover:bg-blue-50 mie:cursor-pointer mie:transition-colors"
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
    <div ref={dropdownRef} className="custom-dropdown custom-dropdown-single-container mie:relative mie:w-full mie:overflow-visible">
      {/* Dropdown trigger button */}
      <div
        className={`custom-dropdown-trigger mie:w-full mie:px-4 mie:py-2 mie:h-10 mie:shadow mie:border mie:border-gray-300 mie:rounded-lg mie:cursor-pointer mie:bg-white mie:flex mie:items-center mie:justify-between mie:hover:border-blue-300 mie:focus:border-blue-400 mie:focus:ring-1 mie:focus:ring-blue-400 mie:transition-colors ${
          disabled ? "mie:opacity-50 mie:cursor-not-allowed mie:bg-gray-50 mie:border-gray-200" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`custom-dropdown-value-text mie:truncate mie:min-w-0 ${selectedOption ? "mie:text-gray-900" : "mie:text-gray-400"}`}>
          {selectedOption ? selectedOption.value : placeholder}
        </span>

        {/* Dropdown arrow */}
        <svg
          className={`custom-dropdown-arrow mie:w-5 mie:h-5 mie:transition-transform mie:shrink-0 ${isOpen ? "mie:rotate-180" : ""}`}
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
          className={`custom-dropdown-menu mie:absolute mie:z-50 mie:w-full mie:mt-1 mie:bg-white mie:border mie:border-gray-200 mie:rounded-lg mie:shadow-lg ${maxHeight} mie:overflow-y-auto`}
        >
          {showClearOption && (
            <div
              className="custom-dropdown-clear-option mie:px-4 mie:py-2 mie:hover:bg-blue-50 mie:cursor-pointer mie:transition-colors"
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
              className={`custom-dropdown-option mie:px-4 mie:py-2 mie:hover:bg-blue-50 mie:cursor-pointer mie:transition-colors ${
                value === option.id ? "mie:bg-blue-100 mie:text-blue-900" : ""
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
