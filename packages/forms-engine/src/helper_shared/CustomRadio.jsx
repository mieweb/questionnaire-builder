import React from "react";

/**
 * CustomRadio - A styled radio button that supports theming and can be unselected.
 * 
 * @param {string} id - Input id
 * @param {string} name - Radio group name
 * @param {string} value - Radio value
 * @param {boolean} checked - Whether radio is selected
 * @param {function} onSelect - Called when radio is selected
 * @param {function} onUnselect - Called when radio is unselected (clicked while selected)
 * @param {boolean} disabled - Whether radio is disabled
 * @param {string} className - Additional wrapper classes
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} hidden - If true, only renders the hidden input (for button-style UIs)
 */
const CustomRadio = React.memo(function CustomRadio({
  id,
  name,
  value,
  checked,
  onSelect,
  onUnselect,
  disabled = false,
  className = "",
  size = "md",
  hidden = false,
  ...props
}) {
  const lastCheckedRef = React.useRef(checked);

  React.useEffect(() => {
    lastCheckedRef.current = checked;
  }, [checked]);

  const handleClick = () => {
    if (disabled) return;
    if (lastCheckedRef.current) {
      onUnselect?.(value);
    } else {
      onSelect?.(value);
    }
  };

  const sizes = {
    sm: { outer: 20, inner: 10 },
    md: { outer: 24, inner: 12 },
    lg: { outer: 36, inner: 18 },
  };

  const currentSize = sizes[size] || sizes.md;

  // Hidden mode: only render the input for form/accessibility
  if (hidden) {
    return (
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onClick={handleClick}
        onChange={() => {}}
        className={`mie:hidden ${className}`}
        {...props}
      />
    );
  }

  return (
    <label 
      htmlFor={id}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick();
      }}
      className={`custom-radio-wrapper mie:inline-flex mie:items-center mie:justify-center mie:cursor-pointer ${className}`}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => {}}
        className="mie:hidden"
        {...props}
      />
      <span
        className={`custom-radio-display mie:inline-flex mie:items-center mie:justify-center mie:rounded-full mie:border-2 mie:transition-all mie:pointer-events-none mie:shrink-0 ${
          checked
            ? "mie:border-mieprimary mie:bg-mieprimary"
            : "mie:border-mieborderinactive mie:bg-miesurface"
        } ${disabled ? "mie:opacity-50" : ""}`}
        style={{ width: currentSize.outer, height: currentSize.outer }}
        aria-hidden="true"
      >
        {checked && (
          <span 
            className="custom-radio-dot mie:rounded-full mie:bg-miesurface"
            style={{ width: currentSize.inner, height: currentSize.inner }}
          />
        )}
      </span>
    </label>
  );
});

export default CustomRadio;
