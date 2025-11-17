import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON, UPARROW_ICON, DOWNARROW_ICON, UPDOWNARROW_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const RankingField = React.memo(function RankingField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

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
        // Sync selected array with options
        React.useEffect(() => {
          if (!f.options || f.options.length === 0) return;
          
          const optionIds = f.options.map(opt => opt.id);
          const currentSelected = Array.isArray(f.selected) ? f.selected : [];
          
          // Remove deleted options from selected
          const validSelected = currentSelected.filter(id => optionIds.includes(id));
          
          // Add new options to the end
          const newOptions = optionIds.filter(id => !validSelected.includes(id));
          const updatedSelected = [...validSelected, ...newOptions];
          
          // Only update if something changed
          if (updatedSelected.length !== currentSelected.length || 
              !updatedSelected.every((id, idx) => id === currentSelected[idx])) {
            api.field.update("selected", updatedSelected);
          }
        }, [f.options, f.selected, api]);

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
                        className="ranking-field-item flex items-center px-3 py-2 my-2 bg-white border border-gray-200 rounded shadow-sm"
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
          <div className="ranking-field-edit">
            <input
              className="px-3 py-2 w-full border border-black/40 rounded"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            {(f.options || []).map((option) => (
              <div key={option.id} className="flex items-center px-4 my-1.5 shadow border border-black/10 rounded-lg">
                <UPDOWNARROW_ICON className="mr-2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => api.option.update(option.id, e.target.value)}
                  placeholder={placeholder?.options || "Option text"}
                  className="w-full py-2"
                />
                <button onClick={() => api.option.remove(option.id)}>
                  <TRASHCANTWO_ICON className="h-5 w-5" />
                </button>
              </div>
            ))}

            <button
              onClick={() => api.option.add()}
              className="mt-2 ml-2 flex gap-3 justify-center"
            >
              <PLUSOPTION_ICON className="h-6 w-6" /> Add Option
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default RankingField;
