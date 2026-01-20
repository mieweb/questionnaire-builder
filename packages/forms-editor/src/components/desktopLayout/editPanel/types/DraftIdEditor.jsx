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
      <label className="mie:block mie:text-sm mie:text-mietext mie:mb-1">{label}</label>
      <input
        className="mie:w-full mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
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
      {err ? <p className="mie:text-xs mie:text-miedanger mie:mt-1">{err}</p> : null}
    </div>
  );
}
