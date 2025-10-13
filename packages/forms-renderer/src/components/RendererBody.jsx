import React, { useMemo } from 'react';
import { useUIApi, useVisibleFields, useUIStore } from '@mieweb/forms-engine';
import { FieldNode } from './FieldNode';

/**
 * Render the body of the questionnaire with visible fields
 */
export function RendererBody() {
  const ui = useUIApi();
  const { fields: visibleFields } = useVisibleFields(ui.state.isPreview);
  const hideUnsupportedFields = useUIStore(s => s.hideUnsupportedFields);

  const visibleIds = useMemo(() => {
    const filtered = hideUnsupportedFields 
      ? visibleFields.filter(f => f.fieldType !== 'unsupported')
      : visibleFields;
    return filtered.map(f => f.id);
  }, [visibleFields, hideUnsupportedFields]);

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
