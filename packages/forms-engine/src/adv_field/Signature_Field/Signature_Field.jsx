import React from "react";
import FieldWrapper from "../../helper_shared/FieldWrapper";
import useFieldController from "../../helper_shared/useFieldController";
import SignatureCanvas from "./SignatureCanvas";
import { TRASHCANTWO_ICON } from "../../helper_shared/icons";

const SignatureField = React.memo(function SignatureField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  const handleSignatureChange = (base64) => {
    ctrl.api.field.update("answer", base64);
  };

  const handleClearSignature = () => {
    ctrl.api.field.update("answer", "");
  };

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="pb-4">
                <div className="font-light mb-2">{f.question || "Question"}</div>
                <div>
                  <SignatureCanvas
                    onSignatureChange={handleSignatureChange}
                    existingSignature={f.answer}
                    placeholder={f.placeholder || "Please sign here"}
                  />
                </div>
              </div>
            </div>
          );
        }

        return (
          <div>
            <input
              className="px-3 py-2 w-full border border-black/40 rounded"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature Pad Settings
              </label>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={f.placeholder || ""}
                    onChange={(e) => api.field.update("placeholder", e.target.value)}
                    placeholder={placeholder?.pad || "e.g., Please sign here"}
                    className="w-full px-3 py-2 border border-gray-200 rounded"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="required-sig"
                    checked={f.required === true}
                    onChange={(e) => api.field.update("required", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="required-sig" className="text-sm text-gray-700">
                    Required signature
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default SignatureField;
