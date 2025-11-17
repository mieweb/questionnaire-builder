import React from "react";

export default function DraftIdEditor({
  id = "",
  label = "ID",
  onCommit,                
  validate,                 
  placeholder = "Enter unique ID…",
  className = "",
}) {
  const [draft, setDraft] = React.useState(id ?? "");
  const [err, setErr] = React.useState("");

  // ────────── Reset when external id changes ──────────
  React.useEffect(() => {
    setDraft(id ?? "");
    setErr("");
  }, [id]);

  const commit = React.useCallback(() => {
    const next = String(draft ?? "").trim();

    // ────────── Basic checks ──────────
    if (!next) {
      setErr("ID cannot be empty.");
      setDraft(id ?? "");
      return;
    }
    if (next === (id ?? "")) return;

    if (typeof validate === "function") {
      const msg = validate(next, id ?? "");
      if (msg) {
        setErr(msg);
        return;
      }
    }

    onCommit?.(next);
  }, [draft, id, onCommit, validate]);

  return (
    <div className={className ? `draft-id-editor-container ${className}` : "draft-id-editor-container"}>
      <label className="block text-sm mb-1">{label}</label>
      <input
        className="w-full px-3 py-2 border border-black/20 rounded"
        value={draft}
        onChange={(e) => {
          if (err) setErr("");
          setDraft(e.target.value);
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        placeholder={placeholder}
      />
      {err ? <p className="text-xs text-red-600 mt-1">{err}</p> : null}
    </div>
  );
}
