import React from "react";

function CommonEditor({ f, onUpdateField }) {

  const [draftId, setDraftId] = React.useState(f.id ?? "");
  const [idError, setIdError] = React.useState("");

  React.useEffect(() => {
    setDraftId(f.id ?? "");
    setIdError("");
  }, [f.id]);

  const commitId = React.useCallback(() => {
    const next = (draftId ?? "").trim();
    if (!next) {
      setIdError("ID cannot be empty.");
      setDraftId(f.id ?? "");
      return;
    }

    if (next === (f.id ?? "")) return;

    onUpdateField?.("id", next); 
  }, [draftId, f.id, onUpdateField]);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm mb-1">ID</label>
        <input
          className="w-full px-3 py-2 border border-black/20 rounded"
          value={draftId}
          onChange={(e) => {
            if (idError) setIdError("");
            setDraftId(e.target.value);
          }}
          onBlur={commitId}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitId();
            }
          }}
          placeholder="Enter unique ID…"
        />
        {idError ? <p className="text-xs text-red-600 mt-1">{idError}</p> : null}
      </div>

      <div>
        <label className="block text-sm mb-1">Label / Question</label>
        <input
          className="w-full px-3 py-2 border border-black/20 rounded"
          value={f.question || ""}
          onChange={(e) => onUpdateField("question", e.target.value)}
          placeholder="Enter question text"
        />
      </div>

      <div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!f.required}
            onChange={(e) => onUpdateField("required", e.target.checked)}
          />
          Required
        </label>
      </div>

      <div>
        <label className="block text-sm mb-1">Sublabel (optional)</label>
        <textarea
          className="w-full px-3 py-2 border border-black/20 rounded"
          value={f.sublabel || ""}
          onChange={(e) => onUpdateField("sublabel", e.target.value)}
          placeholder="Helper text / description"
        />
      </div>
    </div>
  );
}

export default CommonEditor;
