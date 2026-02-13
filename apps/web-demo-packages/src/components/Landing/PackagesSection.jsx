import { InfoRow } from './InfoRow';

export function PackagesSection() {
  return (
    <div className="mt-8">
      <h2 className="m-0 mb-5 text-lg font-semibold text-slate-900 tracking-tight">Packages</h2>
      <div className="grid gap-4 max-w-3xl">
        <InfoRow
          name="@mieweb/forms-engine"
          desc="Core state, field primitives & logic utilities."
          npmLink="https://www.npmjs.com/package/@mieweb/forms-engine"
        />
        <InfoRow
          name="@mieweb/forms-editor"
          desc="Embeddable builder (edit + preview)."
          npmLink="https://www.npmjs.com/package/@mieweb/forms-editor"
        />
        <InfoRow
          name="@mieweb/forms-renderer"
          desc="Read‑only renderer producing FHIR QuestionnaireResponse."
          npmLink="https://www.npmjs.com/package/@mieweb/forms-renderer"
        />
      </div>
    </div>
  );
}
