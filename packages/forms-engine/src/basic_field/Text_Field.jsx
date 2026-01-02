import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const TextField = React.memo(function TextField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  // Format phone number as (XXX) XXX-XXXX
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (value, updateFn) => {
    const formatted = formatPhoneNumber(value);
    updateFn(formatted);
  };

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        const inputType = f.inputType || "text";
        const unit = f.unit || "";
        const isTel = inputType === "tel";
        
        // Get appropriate placeholder based on inputType
        const getPlaceholder = () => {
          if (f.placeholder) return f.placeholder;
          const placeholderMap = {
            'text': 'Enter text',
            'number': 'Enter number',
            'email': 'example@email.com',
            'tel': '(555) 555-5555',
            'date': 'MM/DD/YYYY',
            'datetime-local': 'MM/DD/YYYY HH:MM',
            'month': 'MM/YYYY',
            'time': 'HH:MM',
            'range': '0'
          };
          return placeholderMap[inputType] || 'Type your answer';
        };
        
        if (isPreview) {
          return (
            <div className={`text-field-preview ${insideSection ? "border-b border-gray-200" : "border-0"}`}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
                <div className="font-light wrap-break-word overflow-hidden">{f.question || "Question"}</div>
                <div className="relative">
                  <input
                    type={isTel ? "tel" : inputType}
                    value={f.answer || ""}
                    onChange={(e) => {
                      if (isTel) {
                        handlePhoneChange(e.target.value, (v) => api.field.update("answer", v));
                      } else {
                        api.field.update("answer", e.target.value);
                      }
                    }}
                    placeholder={getPlaceholder()}
                    className={`px-4 py-2 h-10 w-full min-w-0 border border-gray-300 shadow-sm rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors ${unit ? 'pr-16' : ''}`}
                  />
                  {unit && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                      {unit}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="text-field-edit space-y-2">
            <input
              className="px-3 py-2 h-10 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="relative">
              <input
                type={inputType}
                value={f.answer || ""}
                placeholder={getPlaceholder()}
                className={`px-4 py-2 w-full border border-gray-300 shadow-sm rounded-lg bg-gray-50 ${unit ? 'pr-16' : ''}`}
                disabled
              />
              {unit && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
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
