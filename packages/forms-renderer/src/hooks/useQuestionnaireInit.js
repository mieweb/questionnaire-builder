import React from 'react';
import { useFormStore, useUIApi } from '@mieweb/forms-engine';

export function useQuestionnaireInit(fields) {
  const initializedRef = React.useRef(false);
  const ui = useUIApi();

  React.useEffect(() => {
    if (initializedRef.current || !Array.isArray(fields)) return;
    useFormStore.getState().replaceAll(fields);
    ui.preview.set(true);
    initializedRef.current = true;
  }, [fields, ui.preview]);
}
