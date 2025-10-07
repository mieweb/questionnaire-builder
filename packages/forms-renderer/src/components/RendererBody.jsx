import React, { useMemo } from 'react';
import { useUIApi, useVisibleFields } from '@mieweb/forms-engine';
import { FieldNode } from './FieldNode';

/**
 * Render the body of the questionnaire with visible fields
 */
export function RendererBody() {
  const ui = useUIApi();
  const { fields: visibleFields } = useVisibleFields(ui.state.isPreview);

  const visibleIds = useMemo(() => visibleFields.map(f => f.id), [visibleFields]);

  return (
    <div>
      {visibleIds.map(id => (
        <FieldNode 
          key={id} 
          id={id}
        />
      ))}
    </div>
  );
}
