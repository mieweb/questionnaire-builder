import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import DrawingCanvas from "../helper_shared/DrawingCanvas";

const SignatureField = React.memo(function SignatureField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  const handleSignatureChange = (data) => {
    // data is { strokes: string, image: string }
    if (typeof data === "string") {
      // Legacy format or clear
      ctrl.api.field.update("signatureData", data);
      ctrl.api.field.update("signatureImage", "");
    } else {
      // New hybrid format
      ctrl.api.field.update("signatureData", data.strokes);
      ctrl.api.field.update("signatureImage", data.image);
    }
  };

  return (
    <FieldWrapper ctrl={ctrl} noPadding={ ctrl.isPreview === true ? true : false }>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div>
              <div className="mie:px-6 mie:pt-6 mie:pb-2">
                <div className="mie:font-light mie:mb-2 mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
              </div>
              <div className="mie:flex mie:justify-center mie:mx-auto mie:px-2 mie:pb-2 mie:lg:px-6 mie:lg:pb-4">
                <div style={{ width: '100%', maxWidth: '80vw' }} className="mie:md:max-w-[75vw] mie:lg:max-w-full">
                  <DrawingCanvas
                    onDrawingChange={handleSignatureChange}
                    existingDrawing={f.signatureData}
                    placeholder={f.placeholder || "Please sign here"}
                    config={{
                      width: 450,
                      height: 200,
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
          <div className="signature-field-edit mie:space-y-3">
            <input
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-gray-300 mie:rounded-lg mie:focus:border-blue-400 mie:focus:ring-1 mie:focus:ring-blue-400 mie:outline-none mie:transition-colors"
            />

            <div className="mie:p-4 mie:border mie:border-gray-300 mie:rounded-lg mie:bg-gray-50 mie:shadow-sm">
              <label className="mie:block mie:text-sm mie:font-semibold mie:text-gray-700 mie:mb-3">
                Signature Pad Settings
              </label>

              <div className="mie:space-y-3">
                <div>
                  <label className="mie:block mie:text-sm mie:text-gray-600 mie:mb-1">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={f.placeholder || ""}
                    onChange={(e) => api.field.update("placeholder", e.target.value)}
                    placeholder={placeholder?.pad || "e.g., Please sign here"}
                    className="mie:w-full mie:px-3 mie:py-2 mie:border mie:border-gray-300 mie:rounded-lg mie:focus:border-blue-400 mie:focus:ring-1 mie:focus:ring-blue-400 mie:outline-none mie:transition-colors mie:bg-white"
                  />
                </div>

                <div className="mie:flex mie:items-center mie:gap-2">
                  <input
                    type="checkbox"
                    id="required-sig"
                    checked={f.required === true}
                    onChange={(e) => api.field.update("required", e.target.checked)}
                    className="mie:w-4 mie:h-4 mie:cursor-pointer"
                  />
                  <label htmlFor="required-sig" className="mie:text-sm mie:text-gray-700 mie:cursor-pointer">
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
