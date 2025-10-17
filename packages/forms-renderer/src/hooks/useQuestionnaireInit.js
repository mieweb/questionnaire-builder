import React from 'react';
import { useFormStore, useUIApi, adaptSchema } from '@mieweb/forms-engine';

export function useQuestionnaireInit(fields, schemaType = 'inhouse', hideUnsupportedFields = false) {
  const initializedRef = React.useRef(false);
  const ui = useUIApi();
  React.useEffect(() => {
    if (initializedRef.current || !fields) return;
    
    const result = adaptSchema(fields, schemaType);
    const adaptedFields = result.fields || result;
    
    if (result.conversionReport) {
      ui.setConversionReport(result.conversionReport);
    }
    
    useFormStore.getState().replaceAll(adaptedFields);
    ui.preview.set(true);
    initializedRef.current = true;
  }, [fields, schemaType, ui]);

  React.useEffect(() => {
    ui.setHideUnsupportedFields(hideUnsupportedFields);
  }, [hideUnsupportedFields, ui]);
}
