import React from "react";
import { PLUSOPTION_ICON, TRASHCANTWO_ICON } from "../helper_shared/icons";
import CustomDropdown from "../helper_shared/CustomDropdown";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const MultiSelectDropDownField = React.memo(function MultiSelectDropDownField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f, placeholder, instanceId }) => {
        const selectedIds = Array.isArray(f.selected) ? f.selected : [];

        const handleChange = (newSelectedIds) => {
          // Use multiToggle for each change to maintain existing logic
          const preSelected = Array.isArray(f.selected) ? f.selected : [];
          const toAdd = newSelectedIds.filter((id) => !preSelected.includes(id));
          const toRemove = preSelected.filter((id) => !newSelectedIds.includes(id));
          
          toAdd.forEach((id) => api.selection.multiToggle(id));
          toRemove.forEach((id) => api.selection.multiToggle(id));
        };

        if (isPreview) {
          return (
            <div className="multiselect-dropdown-preview mie:text-mietext">
              <div className="mie:grid mie:grid-cols-1 mie:gap-2 mie:sm:grid-cols-2 mie:pb-4">
                <div className="mie:font-light mie:text-mietext mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
                <CustomDropdown
                  options={f.options || []}
                  value={selectedIds}
                  onChange={handleChange}
                  placeholder="Select an option"
                  isMulti={true}
                />
              </div>
            </div>
          );
        }

        // ────────── Edit Mode ──────────
        return (
          <div className="multiselect-dropdown-edit mie:space-y-3">
            <input
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="mie:w-full mie:min-h-10 mie:px-4 mie:py-2 mie:shadow mie:border mie:border-mieborder mie:rounded-lg mie:bg-miebackground mie:flex mie:flex-wrap mie:gap-2 mie:items-center">
              <span className="mie:text-mietextmuted mie:text-sm">Multi-select dropdown (Preview mode only)</span>
            </div>

            <div className="mie:space-y-2">
              {(f.options || []).map((option) => (
                <div
                  key={option.id}
                  className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:rounded-lg mie:shadow-sm mie:hover:border-mietextmuted mie:transition-colors"
                >
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => api.option.update(option.id, e.target.value)}
                    placeholder={placeholder?.options || "Option text"}
                    className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent mie:text-mietext"
                  />
                  <button 
                    onClick={() => api.option.remove(option.id)}
                    className="mie:shrink-0 mie:text-mietextmuted mie:hover:text-miedanger mie:transition-colors mie:bg-transparent mie:border-0 mie:outline-none mie:focus:outline-none"
                    title="Remove option"
                  >
                    <TRASHCANTWO_ICON className="mie:w-5 mie:h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => api.option.add()} 
              className="mie:w-full mie:px-3 mie:py-2 mie:text-sm mie:font-medium mie:text-mieprimary mie:border mie:border-mieprimary/50 mie:rounded-lg mie:bg-miesurface mie:hover:bg-mieprimary/10 mie:transition-colors mie:flex mie:items-center mie:justify-center mie:gap-2"
            >
              <PLUSOPTION_ICON className="mie:w-5 mie:h-5" /> Add Option
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default MultiSelectDropDownField;
