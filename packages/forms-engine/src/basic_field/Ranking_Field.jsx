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
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        if (isPreview) {
          const ranking = Array.isArray(f.selected) && f.selected.length > 0 
            ? f.selected 
            : (f.options || []).map(opt => opt.id);
          
          const optionsMap = (f.options || []).reduce((acc, opt) => {
            acc[opt.id] = opt.value;
            return acc;
          }, {});

          return (
            <div className={`ranking-field-preview ${insideSection ? "border-b border-gray-200" : "border-0"}`}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
                <div className="font-light">{f.question || "Question"}</div>
                <div>
                  {ranking.map((optId, index) => {
                    const optionText = optionsMap[optId] || "Unknown option";
                    const canMoveUp = index > 0;
                    const canMoveDown = index < ranking.length - 1;

                    return (
                      <div
                        key={optId}
                        className="ranking-field-item flex items-center px-3 py-2 my-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center flex-1">
                          <span>{optionText}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => moveItem(api, optId, "up")}
                            disabled={!canMoveUp}
                            className={`p-1 ${canMoveUp ? "text-gray-700 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"}`}
                            aria-label="Move up"
                          >
                            <UPARROW_ICON className="h-6 w-6" />
                          </button>
                          <button
                            onClick={() => moveItem(api, optId, "down")}
                            disabled={!canMoveDown}
                            className={`p-1 ${canMoveDown ? "text-gray-700 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"}`}
                            aria-label="Move down"
                          >
                            <DOWNARROW_ICON className="h-6 w-6" />
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
          <div className="ranking-field-edit space-y-3">
            <input
              className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="space-y-2">
              {(f.options || []).map((option) => (
                <div key={option.id} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors">
                  <UPDOWNARROW_ICON className="text-gray-400 w-5 h-5 flex-shrink-0" />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => api.option.update(option.id, e.target.value)}
                    placeholder={placeholder?.options || "Option text"}
                    className="flex-1 min-w-0 outline-none bg-transparent"
                  />
                  <button 
                    onClick={() => api.option.remove(option.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove option"
                  >
                    <TRASHCANTWO_ICON className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => api.option.add()}
              className="w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <PLUSOPTION_ICON className="w-5 h-5" /> Add Option
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default RankingField;
