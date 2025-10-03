import React from 'react';
import { useUIApi, useFieldsArray, isVisible } from '@mieweb/forms-engine';
import { FieldNode } from './FieldNode';

/**
 * Render the body of the questionnaire with visible fields
 */
export function RendererBody() {
  const ui = useUIApi();
  const fields = useFieldsArray() || [];
  
  // Flatten all fields including section children
  const flat = React.useMemo(() => {
    const out = [];
    fields.forEach(f => {
      out.push(f);
      if (f?.fieldType === 'section' && Array.isArray(f.fields)) {
        out.push(...f.fields);
      }
    });
    return out;
  }, [fields]);

  // Filter visible fields based on enableWhen logic
  const visible = React.useMemo(() => {
    if (!ui.state.isPreview) return fields;
    return fields.filter(f => isVisible(f, flat));
  }, [fields, flat, ui.state.isPreview]);

  return (
    <div>
      {visible.map(f => (
        <FieldNode 
          key={f.id} 
          field={f} 
          allFlat={flat}
          isPreview={ui.state.isPreview}
        />
      ))}
    </div>
  );
}
