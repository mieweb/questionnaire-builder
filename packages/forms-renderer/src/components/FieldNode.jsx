import React from 'react';
import { getFieldComponent, isVisible } from '@mieweb/forms-engine';

export function FieldNode({ field, allFlat, isPreview }) {
  const Comp = getFieldComponent(field.fieldType);
  if (!Comp) return null;

  if (field.fieldType === 'section' && isPreview && Array.isArray(field.fields)) {
    const visibleChildren = field.fields.filter(ch => isVisible(ch, allFlat));
    const filteredSection = { ...field, fields: visibleChildren };
    return <Comp field={filteredSection} />;
  }

  return <Comp field={field} />;
}
