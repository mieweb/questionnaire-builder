import React from 'react';
import { useUIApi, useVisibleFields } from '@mieweb/forms-engine';
import { FieldNode } from './FieldNode';

/**
 * Render the body of the questionnaire with visible fields
 */
export function RendererBody() {
  const ui = useUIApi();
  const { fields: visible, allFlat } = useVisibleFields(ui.state.isPreview);

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
