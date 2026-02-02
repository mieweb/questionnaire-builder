import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const TextField = React.memo(function TextField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  // Format phone numbers:
  // - International (+XX ...): Keep + and country code, first space, then convert spaces to dashes
  // - US (+1 or no +): Format as (XXX) XXX-XXXX
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    
    // Handle international format with country code
    if (value.startsWith('+')) {
      // Check if it's +1 (US/Canada country code)
      const digitsOnly = value.replace(/[^\d]/g, '');
      if (value.startsWith('+1') && digitsOnly.length === 11) {
        // Format as US number: +1 (XXX) XXX-XXXX
        const usDigits = digitsOnly.slice(1); // Remove the '1'
        return `+1 (${usDigits.slice(0, 3)}) ${usDigits.slice(3, 6)}-${usDigits.slice(6, 10)}`;
      }
      
      // For other country codes, preserve + and country code, keep first space, convert rest to dashes
      const firstSpaceIndex = value.indexOf(' ');
      if (firstSpaceIndex === -1) return value; // No space yet, return as-is
      
      const countryCodePart = value.slice(0, firstSpaceIndex + 1); // e.g., "+44 "
      const restOfNumber = value.slice(firstSpaceIndex + 1).replace(/\s+/g, '-'); // Convert spaces to dashes
      return countryCodePart + restOfNumber;
    }
    
    // US format without country code
    const digitsOnly = value.replace(/[^\d]/g, '');
    const digitCount = digitsOnly.length;
    
    // Only format if exactly 10 digits (US number)
    if (digitCount === 10) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
    }
    
    // For partial entry (< 10 digits), format progressively
    if (digitCount < 4) return digitsOnly;
    if (digitCount < 7) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
    }
    if (digitCount < 10) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    }
    
    // For 11+ digits without +, preserve original
    return value;
  };

  const handlePhoneChange = (value, updateFn) => {
    const formatted = formatPhoneNumber(value);
    updateFn(formatted);
  };

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f, placeholder, instanceId }) => {
        const inputType = f.inputType || "string";
        const unit = f.unit || "";
        const isTel = inputType === "tel";
        
        // Get appropriate placeholder based on inputType
        const getPlaceholder = () => {
          if (f.placeholder) return f.placeholder;
          const placeholderMap = {
            'string': 'Enter text',
            'number': 'Enter number',
            'email': 'example@email.com',
            'tel': '(555) 555-5555',
            'date': 'MM/DD/YYYY',
            'datetime-local': 'MM/DD/YYYY HH:MM',
            'month': 'MM/YYYY',
            'time': 'HH:MM'
          };
          return placeholderMap[inputType] || 'Type your answer';
        };
        
        if (isPreview) {
          return (
            <div className="text-field-preview">
              <div className="mie:grid mie:grid-cols-1 mie:gap-2 mie:sm:grid-cols-2 mie:pb-4">
                <div className="mie:font-light mie:text-mietext mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
                <div className="mie:relative">
                  <input
                    id={`${instanceId}-text-answer-${f.id}`}
                    aria-label={f.question || "Question"}
                    type={inputType}
                    value={f.answer || ""}
                    onChange={(e) => {
                      if (isTel) {
                        handlePhoneChange(e.target.value, (v) => api.field.update("answer", v));
                      } else {
                        api.field.update("answer", e.target.value);
                      }
                    }}
                    placeholder={getPlaceholder()}
                    className={`mie:px-4 mie:py-2 mie:h-10 mie:w-full mie:min-w-0 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:shadow-sm mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary/30 mie:outline-none mie:transition-colors ${unit ? 'mie:pr-16' : ''}`}
                  />
                  {unit && (
                    <span className="mie:absolute mie:right-3 mie:top-1/2 mie:-translate-y-1/2 mie:text-sm mie:text-mietextmuted mie:pointer-events-none">
                      {unit}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="mie:text-field-edit mie:space-y-2">
            <div>
              <label htmlFor={`${instanceId}-text-question-${f.id}`} className="mie:block mie:text-sm mie:font-medium mie:text-mietextmuted mie:mb-1">
                Question
              </label>
              <input
                id={`${instanceId}-text-question-${f.id}`}
                aria-label="Question"
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary/30 mie:outline-none mie:transition-colors"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />
            </div>

            <div className="mie:relative">
              <input
                id={`${instanceId}-text-answer-${f.id}`}
                aria-label="Answer preview"
                type={inputType}
                value={f.answer || ""}
                placeholder={getPlaceholder()}
                className={`mie:px-4 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:shadow-sm mie:rounded-lg mie:bg-miebackground mie:text-mietextmuted ${unit ? 'mie:pr-16' : ''}`}
                disabled
              />
              {unit && (
                <span className="mie:absolute mie:right-3 mie:top-1/2 mie:-translate-y-1/2 mie:text-sm mie:text-mietextmuted">
                  {unit}
                </span>
              )}
            </div>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default TextField;
