import React from 'react';
import { useFormStore, useUIApi, adaptSchema } from '@mieweb/forms-engine';

export function useQuestionnaireInit(fields, schemaType = 'inhouse') {
  const initializedRef = React.useRef(false);
  const ui = useUIApi();

  React.useEffect(() => {
    if (initializedRef.current || !fields) return;
    
    // Adapt schema if needed, then let formStore normalize
    const adaptedFields = adaptSchema(fields, schemaType);
    useFormStore.getState().replaceAll(adaptedFields);
    ui.preview.set(true);
    initializedRef.current = true;
  }, [fields, schemaType, ui.preview]);
}
