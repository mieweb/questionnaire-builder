import React from 'react';
import { getFieldComponent, useFormStore } from '@mieweb/forms-engine';

/* eslint-disable react-hooks/static-components -- getFieldComponent is a pure registry lookup, returns stable component refs */
export const FieldNode = React.memo(function FieldNode({ id }) {
  const field = useFormStore(React.useCallback((s) => s.byId[id], [id]));
  const FieldComponent = field ? getFieldComponent(field.fieldType) : null;

  if (!field || !FieldComponent) return null;

  return (
    <div className="field-node-wrapper mie:mb-1.5" data-field-type={field.fieldType} data-field-id={field.id}>
      <FieldComponent field={field} />
    </div>
  );
});
/* eslint-enable react-hooks/static-components */
