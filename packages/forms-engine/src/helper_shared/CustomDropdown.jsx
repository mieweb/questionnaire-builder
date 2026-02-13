import { useState, useRef, useEffect } from "react";

const CustomDropdown = function CustomDropdown({
  options = [],
  value = null,
  onChange = () => {},
  placeholder = "Select an option",
  showClearOption = true,
  maxHeight = "mie:max-h-60",
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
          className={`custom-dropdown-trigger mie:w-full mie:min-h-10 mie:px-3 mie:py-2 mie:shadow mie:border mie:border-mieborder mie:rounded-lg mie:cursor-pointer mie:bg-miesurface mie:flex mie:flex-wrap mie:gap-2 mie:items-center mie:hover:border-mieprimary/50 mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:transition-colors ${
            disabled ? "mie:opacity-50 mie:cursor-not-allowed mie:bg-miebackground mie:border-mieborder" : ""
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {selectedOptions.length === 0 ? (
            <span className="mie:text-mietextmuted">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.id}
                className="custom-dropdown-selected-pill mie:inline-flex mie:items-center mie:gap-1 mie:px-3 mie:py-1 mie:bg-mieprimary mie:text-miesurface mie:rounded mie:text-sm"
              >
                {option.value}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option.id);
                  }}
                  className="custom-dropdown-remove-btn mie:flex mie:items-center mie:justify-center mie:bg-transparent mie:text-miesurface mie:hover:bg-mieprimary/80 mie:rounded mie:border-0 mie:outline-none mie:focus:outline-none"
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
            className={`mie:w-5 mie:h-5 mie:ml-auto mie:transition-transform mie:shrink-0 mie:text-mietextmuted ${isOpen ? "mie:rotate-180" : ""}`}
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
            className={`custom-dropdown-menu mie:absolute mie:z-9999 mie:w-full mie:mt-1 mie:bg-miesurface mie:border mie:border-mieborder mie:rounded-lg mie:shadow-lg ${maxHeight} mie:overflow-y-auto`}
          >
            {availableOptions.map((option) => (
              <div
                key={option.id}
                className="custom-dropdown-option mie:px-4 mie:py-2 mie:text-mietext mie:hover:bg-mieprimary/10 mie:cursor-pointer mie:transition-colors"
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
        className={`custom-dropdown-trigger mie:w-full mie:px-4 mie:py-2 mie:h-10 mie:shadow mie:border mie:border-mieborder mie:rounded-lg mie:cursor-pointer mie:bg-miesurface mie:flex mie:items-center mie:justify-between mie:hover:border-mieprimary/50 mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:transition-colors ${
          disabled ? "mie:opacity-50 mie:cursor-not-allowed mie:bg-miebackground mie:border-mieborder" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`custom-dropdown-value-text mie:truncate mie:min-w-0 ${selectedOption ? "mie:text-mietext" : "mie:text-mietextmuted"}`}>
          {selectedOption ? selectedOption.value : placeholder}
        </span>

        {/* Dropdown arrow */}
        <svg
          className={`custom-dropdown-arrow mie:w-5 mie:h-5 mie:transition-transform mie:shrink-0 mie:text-mietextmuted ${isOpen ? "mie:rotate-180" : ""}`}
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
          className={`custom-dropdown-menu mie:absolute mie:z-50 mie:w-full mie:mt-1 mie:bg-miesurface mie:border mie:border-mieborder mie:rounded-lg mie:shadow-lg ${maxHeight} mie:overflow-y-auto`}
        >
          {showClearOption && (
            <div
              className="custom-dropdown-clear-option mie:px-4 mie:py-2 mie:text-mietext mie:hover:bg-mieprimary/10 mie:cursor-pointer mie:transition-colors"
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
              className={`custom-dropdown-option mie:px-4 mie:py-2 mie:hover:bg-mieprimary/10 mie:cursor-pointer mie:transition-colors ${
                value === option.id ? "mie:bg-mieprimary/20 mie:text-mieprimary" : "mie:text-mietext"
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
