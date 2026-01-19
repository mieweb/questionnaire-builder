import React from "react";

const INPUT_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone Number" },
  { value: "date", label: "Date" },
  { value: "datetime-local", label: "Date & Time" },
  { value: "month", label: "Month" },
  { value: "time", label: "Time" },
  { value: "range", label: "Range" }
];

const UNITS = {
  Length: [
    { value: "mm", label: "Millimeters (mm)" },
    { value: "cm", label: "Centimeters (cm)" },
    { value: "m", label: "Meters (m)" },
    { value: "km", label: "Kilometers (km)" },
    { value: "in", label: "Inches (in)" },
    { value: "ft", label: "Feet (ft)" },
    { value: "yd", label: "Yards (yd)" },
    { value: "mi", label: "Miles (mi)" }
  ],
  Weight: [
    { value: "mg", label: "Milligrams (mg)" },
    { value: "g", label: "Grams (g)" },
    { value: "kg", label: "Kilograms (kg)" },
    { value: "oz", label: "Ounces (oz)" },
    { value: "lb", label: "Pounds (lb)" }
  ],
  Volume: [
    { value: "ml", label: "Milliliters (ml)" },
    { value: "l", label: "Liters (l)" },
    { value: "fl-oz", label: "Fluid Ounces (fl oz)" },
    { value: "cup", label: "Cups" },
    { value: "pt", label: "Pints (pt)" },
    { value: "qt", label: "Quarts (qt)" },
    { value: "gal", label: "Gallons (gal)" }
  ],
  Temperature: [
    { value: "c", label: "Celsius (°C)" },
    { value: "f", label: "Fahrenheit (°F)" },
    { value: "k", label: "Kelvin (K)" }
  ],
  Other: [
    { value: "percent", label: "Percent (%)" },
    { value: "bpm", label: "Beats per minute (bpm)" },
    { value: "mmHg", label: "mmHg (blood pressure)" }
  ]
};

export default function InputTypeEditor({ field, onUpdate }) {
  const inputType = field.inputType || "text";
  const unit = field.unit || "";
  const showUnitSelector = inputType === "number" || inputType === "range";

  return (
    <div className="mie:space-y-3">
      <div>
        <label className="mie:block mie:text-sm mie:mb-1">Input Type</label>
        <select
          className="mie:w-full mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:cursor-pointer mie:transition-colors"
          value={inputType}
          onChange={(e) => onUpdate("inputType", e.target.value)}
        >
          {INPUT_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      
      {showUnitSelector && (
        <div>
          <label className="mie:block mie:text-sm mie:mb-1">Unit (optional)</label>
          <select
            className="mie:w-full mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:cursor-pointer mie:transition-colors"
            value={unit}
            onChange={(e) => onUpdate("unit", e.target.value)}
          >
            <option value="">None</option>
            {Object.entries(UNITS).map(([category, units]) => (
              <optgroup key={category} label={category}>
                {units.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
