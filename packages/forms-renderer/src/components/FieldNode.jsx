import React from 'react';
import { getFieldComponent, isVisible } from '@mieweb/forms-engine';

/**
 * Render a single field node with visibility logic
 */
export function FieldNode({ field, allFlat, isPreview }) {
  const Comp = getFieldComponent(field.fieldType);
  if (!Comp) return null;

  // For sections: filter their child fields by visibility when in preview
  if (field.fieldType === 'section' && isPreview && Array.isArray(field.fields)) {
    const visibleChildren = field.fields.filter(ch => isVisible(ch, allFlat));
    // Shallow clone to avoid mutating original structure
    const filteredSection = { ...field, fields: visibleChildren };
    return <Comp field={filteredSection} />;
  }

  return <Comp field={field} />;
}
