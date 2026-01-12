import React from 'react';
import { getFieldComponent, useFormStore } from '@mieweb/forms-engine';

export const FieldNode = React.memo(function FieldNode({ id }) {
  const field = useFormStore(React.useCallback((s) => s.byId[id], [id]));
  
  if (!field) return null;

  const FieldComponent = getFieldComponent(field.fieldType);

  if (!FieldComponent) return null;

  return (
    <div className="field-node-wrapper mie:mb-1.5" data-field-type={field.fieldType} data-field-id={field.id}>
      <FieldComponent field={field} />
    </div>
  );
});
