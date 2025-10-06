import React from 'react';
import { useUIApi, useFlatArray, isVisible } from '@mieweb/forms-engine';
import { FieldNode } from './FieldNode';

/**
 * Render the body of the questionnaire with visible fields
 */
export function RendererBody() {
  const ui = useUIApi();
  const flat = useFlatArray(); // Already flattened by the store

  // Filter visible fields based on enableWhen logic
  const visible = React.useMemo(() => {
    if (!ui.state.isPreview) return flat;
    return flat.filter(f => isVisible(f, flat));
  }, [flat, ui.state.isPreview]);

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
