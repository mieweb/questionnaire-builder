import React from "react";

/**
 * A radio button that can be unselected by clicking it again when already selected.
 */
const UnselectableRadio = React.memo(function UnselectableRadio({
  id,
  name,
  value,
  checked,
  onSelect,
  onUnselect,
  className = "",
  ...props
}) {
  const lastCheckedRef = React.useRef(checked);

  React.useEffect(() => {
    lastCheckedRef.current = checked;
  }, [checked]);

  return (
    <input
      id={id}
      type="radio"
      name={name}
      value={value}
      className={className}
      checked={checked}
      onClick={() => {
        if (lastCheckedRef.current) {
          onUnselect?.(value);
        } else {
          onSelect?.(value);
        }
      }}
      onChange={() => {}}
      {...props}
    />
  );
});

export default UnselectableRadio;
