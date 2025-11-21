import React from 'react';
import { useUIApi, useVisibleFields, useUIStore } from '@mieweb/forms-engine';
import { FieldNode } from './FieldNode';

export function RendererBody() {
  const ui = useUIApi();
  const { fields: visibleFields } = useVisibleFields(ui.state.isPreview);
  const hideUnsupportedFields = useUIStore(s => s.hideUnsupportedFields);

  const visibleIds = React.useMemo(() => {
    const filtered = hideUnsupportedFields 
      ? visibleFields.filter(f => f.fieldType !== 'unsupported')
      : visibleFields;
    return filtered.map(f => f.id);
  }, [visibleFields, hideUnsupportedFields]);

  return (
    <div className="renderer-body-container">
      {visibleIds.map(id => (
        <FieldNode 
          key={id} 
          id={id}
        />
      ))}
    </div>
  );
}
