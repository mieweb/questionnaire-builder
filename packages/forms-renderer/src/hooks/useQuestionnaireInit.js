import React from 'react';
import { useFormStore, useUIApi, adaptSchema } from '@mieweb/forms-engine';

export function useQuestionnaireInit(fields, schemaType = 'inhouse', hideUnsupportedFields = false) {
  const initializedRef = React.useRef(false);
  const ui = useUIApi();


  React.useEffect(() => {
    if (initializedRef.current || !fields) return;
    
    const result = adaptSchema(fields, schemaType);
    
    const adaptedFields = result.fields || result;
    const conversionReport = result.conversionReport;
    
    if (conversionReport) {
      ui.setConversionReport(conversionReport);
      
      console.log('[QuestionnaireRenderer] Schema conversion complete:', {
        totalElements: conversionReport.totalElements,
        convertedFields: conversionReport.convertedFields,
        droppedFields: conversionReport.droppedFields.length,
        warnings: conversionReport.warnings.length
      });
      
      if (conversionReport.warnings.length > 0) {
        console.warn('[QuestionnaireRenderer] Conversion warnings detected. Some features may not work as expected.');
        
        const highImpact = conversionReport.warnings.filter(w => w.impact === 'high');
        const mediumImpact = conversionReport.warnings.filter(w => w.impact === 'medium');
        
        if (highImpact.length > 0) {
          console.warn(`⚠️ HIGH IMPACT (${highImpact.length}):`, highImpact);
        }
        if (mediumImpact.length > 0) {
          console.warn(`⚠️ MEDIUM IMPACT (${mediumImpact.length}):`, mediumImpact);
        }
      }
      
      if (conversionReport.droppedFields.length > 0) {
        console.error('❌ DROPPED FIELDS:', conversionReport.droppedFields);
      }
    }
    
    useFormStore.getState().replaceAll(adaptedFields);
    ui.preview.set(true);
    initializedRef.current = true;
  }, [fields, schemaType, ui]);

  React.useEffect(() => {
    ui.setHideUnsupportedFields(hideUnsupportedFields);
  }, [hideUnsupportedFields, ui]);
}
