import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import DrawingCanvas from "../helper_shared/DrawingCanvas";

const SignatureField = React.memo(function SignatureField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  const handleSignatureChange = (base64) => {
    ctrl.api.field.update("answer", base64);
  };

  return (
    <FieldWrapper ctrl={ctrl} noPadding={ ctrl.isPreview === true ? true : false }>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="px-6 pt-6 pb-2">
                <div className="font-light mb-2">{f.question || "Question"}</div>
              </div>
              <div className="flex justify-center mx-auto px-2 pb-2 lg:px-6 lg:pb-4">
                <div style={{ width: '100%', maxWidth: '80vw' }} className="md:max-w-[75vw] lg:max-w-full">
                  <DrawingCanvas
                    onDrawingChange={handleSignatureChange}
                    existingDrawing={f.answer}
                    placeholder={f.placeholder || "Please sign here"}
                    config={{
                      width: 450,
                      height: 150,
                      strokeColor: "#000000",
                      strokeWidth: 2,
                      hasEraser: false,
                      showControls: true,
                      backgroundColor: "#FFFFFF",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-3">
            <input
              className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="required-sig"
                    checked={f.required === true}
                    onChange={(e) => api.field.update("required", e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="required-sig" className="text-sm text-gray-700 cursor-pointer">
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
