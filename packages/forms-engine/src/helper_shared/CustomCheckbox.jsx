import React from "react";

/**
 * CustomCheckbox - A styled checkbox that supports theming.
 * 
 * @param {string} id - Input id
 * @param {string} name - Input name
 * @param {boolean} checked - Whether checkbox is checked
 * @param {function} onChange - Called when checkbox state changes
 * @param {boolean} disabled - Whether checkbox is disabled
 * @param {string} className - Additional wrapper classes
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} hidden - If true, only renders the hidden input (for button-style UIs)
 */
const CustomCheckbox = React.memo(function CustomCheckbox({
  id,
  name,
  checked,
  onChange,
  disabled = false,
  className = "",
  size = "md",
  hidden = false,
  ...props
}) {
  const sizes = {
    sm: { outer: 20, inner: 12 },
    md: { outer: 24, inner: 16 },
    lg: { outer: 36, inner: 24 },
  };

  const currentSize = sizes[size] || sizes.md;

  // Hidden mode: only render the input for form/accessibility
  if (hidden) {
    return (
      <input
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.(!checked)}
        className={`mie:hidden ${className}`}
        {...props}
      />
    );
  }

  return (
    <label 
      htmlFor={id}
      onClick={(e) => e.stopPropagation()}
      className={`custom-checkbox-wrapper mie:inline-flex mie:items-center mie:justify-center mie:cursor-pointer ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.(!checked)}
        className="mie:hidden"
        {...props}
      />
      <span
        className={`custom-checkbox-display mie:inline-flex mie:items-center mie:justify-center mie:rounded mie:border-2 mie:transition-all mie:pointer-events-none mie:shrink-0 ${
          checked
            ? "mie:border-mieprimary mie:bg-mieprimary"
            : "mie:border-gray-400 mie:bg-miesurface"
        } ${disabled ? "mie:opacity-50" : ""}`}
        style={{ width: currentSize.outer, height: currentSize.outer, minWidth: currentSize.outer, minHeight: currentSize.outer }}
        aria-hidden="true"
      >
        <svg
          className="custom-checkbox-checkmark mie:text-miesurface"
          style={{ width: currentSize.inner, height: currentSize.inner, opacity: checked ? 1 : 0 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </label>
  );
});

export default CustomCheckbox;
