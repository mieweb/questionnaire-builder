import React from "react";
import { ARROWDOWN_ICON, TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../../assets/icons";
import FieldWrapper from "../shared/FieldWrapper";
import { useFieldController } from "../shared/useFieldController";

const DropDownField = React.memo(function DropDownField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection }) => {
        // ────────── Outer shell (shared) ──────────
        const outerClass = [
          "p-4",
          isPreview && !insideSection ? "border border-gray-300 rounded-lg" : "",
        ].join(" ");

        // ────────── Shared option nodes for <select> ──────────
        const optionNodes = (field.options || []).map((o) => (
          <option key={o.id} value={o.id}>{o.value}</option>
        ));

        // ────────── Shared select classes / icon position ──────────
        const selectClass = [
          "w-full",
          "px-4",
          "shadow",
          "border border-black/10",
          "rounded-lg",
          "h-10",
          "appearance-none",
          !isPreview ? "pr-10 mt-2" : "",
        ].join(" ");
        const arrowClass = `absolute ${isPreview ? "top-2" : "top-4"} bottom-0 right-2`;

        return (
          <div className={outerClass}>
            {isPreview ? (
              // ────────── Preview ──────────
              <div className={`grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4 ${insideSection ? "border-b border-gray-300" : ""}`}>
                <div className="font-light">{field.question || "Question"}</div>
                <div className="relative">
                  <select
                    className={selectClass}
                    value={field.selected || ""}
                    onChange={(e) => api.selection.single(e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {optionNodes}
                  </select>
                  <ARROWDOWN_ICON className={arrowClass} />
                </div>
              </div>
            ) : (
              // ────────── Edit ──────────
              <>
                <input
                  className="px-3 py-2 w-full border border-black/40 rounded"
                  value={field.question || ""}
                  onChange={(e) => api.field.update("question", e.target.value)}
                  placeholder="Enter question"
                />

                <div className="relative">
                  <select className={selectClass} disabled>
                    <option value="">Select an option</option>
                    {optionNodes}
                  </select>
                  <ARROWDOWN_ICON className={arrowClass} />
                </div>

                {(field.options || []).map((o) => (
                  <div key={o.id} className="flex items-center px-3 my-1.5 shadow border border-black/10 rounded-lg h-10">
                    <input
                      className="w-full"
                      value={o.value}
                      onChange={(e) => api.option.update(o.id, e.target.value)}
                      placeholder="Option text"
                    />
                    <button onClick={() => api.option.remove(o.id)}>
                      <TRASHCANTWO_ICON className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <button onClick={() => api.option.add()} className="mt-2 ml-2 flex gap-3 justify-center">
                  <PLUSOPTION_ICON className="h-6 w-6" /> Add Option
                </button>
              </>
            )}
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default DropDownField;
