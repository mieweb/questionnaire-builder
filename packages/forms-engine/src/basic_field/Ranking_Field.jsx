import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON, UPARROW_ICON, DOWNARROW_ICON, UPDOWNARROW_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const RankingField = React.memo(function RankingField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  // Sync selected array with options - moved outside render function
  React.useEffect(() => {
    if (!ctrl.field.options || ctrl.field.options.length === 0) return;
    
    const optionIds = ctrl.field.options.map(opt => opt.id);
    const currentSelected = Array.isArray(ctrl.field.selected) ? ctrl.field.selected : [];
    
    // Remove deleted options from selected
    const validSelected = currentSelected.filter(id => optionIds.includes(id));
    
    // Add new options to the end
    const newOptions = optionIds.filter(id => !validSelected.includes(id));
    const updatedSelected = [...validSelected, ...newOptions];
    
    // Only update if something changed
    if (updatedSelected.length !== currentSelected.length || 
        !updatedSelected.every((id, idx) => id === currentSelected[idx])) {
      ctrl.api.field.update("selected", updatedSelected);
    }
  }, [ctrl.field.options, ctrl.field.selected, ctrl.api]);

  const moveItem = (api, optId, direction) => {
    const currentRanking = Array.isArray(field.selected) ? field.selected : [];
    const currentIndex = currentRanking.indexOf(optId);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= currentRanking.length) return;
    
    const newRanking = [...currentRanking];
    [newRanking[currentIndex], newRanking[newIndex]] = [newRanking[newIndex], newRanking[currentIndex]];
    
    api.field.update("selected", newRanking);
  };

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f, placeholder, instanceId }) => {
        if (isPreview) {
          const ranking = Array.isArray(f.selected) && f.selected.length > 0 
            ? f.selected 
            : (f.options || []).map(opt => opt.id);
          
          const optionsMap = (f.options || []).reduce((acc, opt) => {
            acc[opt.id] = opt.value;
            return acc;
          }, {});

          return (
            <div className="ranking-field-preview mie:text-mietext">
              <div className="mie:grid mie:grid-cols-1 mie:gap-2 mie:sm:grid-cols-2 mie:pb-4">
                <div className="mie:font-light mie:text-mietext mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
                <div>
                  {ranking.map((optId, index) => {
                    const optionText = optionsMap[optId] || "Unknown option";
                    const canMoveUp = index > 0;
                    const canMoveDown = index < ranking.length - 1;

                    return (
                      <div
                        key={optId}
                        className="ranking-field-item mie:flex mie:items-center mie:px-3 mie:py-2 mie:my-2 mie:bg-miesurface mie:border mie:border-mieborder mie:rounded-lg mie:shadow-sm mie:hover:border-mieprimary/50 mie:hover:bg-mieprimary/10 mie:transition-colors"
                      >
                        <div className="mie:flex mie:items-center mie:flex-1">
                          <span className="mie:text-mietext">{optionText}</span>
                        </div>
                        <div className="mie:flex mie:items-center mie:gap-1 mie:ml-2">
                          <button
                            onClick={() => moveItem(api, optId, "up")}
                            disabled={!canMoveUp}
                            className={`mie:p-1 mie:bg-transparent mie:border-0 mie:outline-none mie:focus:outline-none ${canMoveUp ? "mie:text-mietext mie:hover:text-mieprimary" : "mie:text-mieborder mie:cursor-not-allowed"}`}
                            aria-label="Move up"
                          >
                            <UPARROW_ICON className="mie:h-6 mie:w-6" />
                          </button>
                          <button
                            onClick={() => moveItem(api, optId, "down")}
                            disabled={!canMoveDown}
                            className={`mie:p-1 mie:bg-transparent mie:border-0 mie:outline-none mie:focus:outline-none ${canMoveDown ? "mie:text-mietext mie:hover:text-mieprimary" : "mie:text-mieborder mie:cursor-not-allowed"}`}
                            aria-label="Move down"
                          >
                            <DOWNARROW_ICON className="mie:h-6 mie:w-6" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="ranking-field-edit mie:space-y-3">
            <div>
              <label htmlFor={`${instanceId}-ranking-question-${f.id}`} className="mie:block mie:text-sm mie:font-medium mie:text-mietextmuted mie:mb-1">
                Question
              </label>
              <input
                id={`${instanceId}-ranking-question-${f.id}`}
                aria-label="Question"
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />
            </div>

            <div>
              <span className="mie:block mie:text-sm mie:font-medium mie:text-mietextmuted mie:mb-2">Items</span>
              <div className="mie:space-y-2">
                {(f.options || []).map((option) => (
                <div key={option.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:rounded-lg mie:shadow-sm mie:hover:border-mietextmuted mie:transition-colors">
                  <UPDOWNARROW_ICON className="mie:text-mietextmuted mie:w-5 mie:h-5 mie:shrink-0" />
                  <input
                    id={`${instanceId}-ranking-option-${f.id}-${option.id}`}
                    aria-label={`Option ${option.id}`}
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
            </div>

            <button
              onClick={() => api.option.add()}
              className="mie:w-full mie:px-3 mie:py-2 mie:text-sm mie:font-medium mie:text-mieprimary mie:border mie:border-mieprimary/50 mie:rounded-lg mie:bg-miesurface mie:hover:bg-mieprimary/10 mie:transition-colors mie:flex mie:items-center mie:justify-center mie:gap-2 mie:outline-none mie:focus:outline-none"
            >
              <PLUSOPTION_ICON className="mie:w-5 mie:h-5" /> Add Option
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default RankingField;
