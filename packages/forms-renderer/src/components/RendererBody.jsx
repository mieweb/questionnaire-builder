import React from 'react';
import { useUIApi, useFieldsArray, isVisible } from '@mieweb/forms-engine';
import { FieldNode } from './FieldNode';

/**
 * Render the body of the questionnaire with visible fields
 */
export function RendererBody() {
  const ui = useUIApi();
  const fields = useFieldsArray();

  // Build flat array directly from fields (like FormBuilderMain does)
  const allFlat = React.useMemo(() => {
    const out = [];
    (fields || []).forEach(f => {
      out.push(f);
      if (f?.fieldType === "section" && Array.isArray(f.fields)) {
        out.push(...f.fields);
      }
    });
    return out;
  }, [fields]);

  const visible = React.useMemo(() => {
    if (!ui.state.isPreview) return fields;
    return fields.filter(f => isVisible(f, allFlat));
  }, [ui.state.isPreview, fields, allFlat]);

  return (
    <div>
      {visible.map(f => (
        <FieldNode 
          key={f.id} 
          field={f} 
          allFlat={allFlat}
          isPreview={ui.state.isPreview}
        />
      ))}
    </div>
  );
}
