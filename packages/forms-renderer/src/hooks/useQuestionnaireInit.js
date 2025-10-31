import React from 'react';
import { FormStoreContext, useUIApi, adaptSchema, parseAndDetect } from '@mieweb/forms-engine';

/**
 * Initialize questionnaire with flexible input format
 * @param {string|object} formData - YAML string, JSON string, or form data object
 * @param {string} [schemaType] - Optional: 'mieforms' or 'surveyjs' (auto-detected if not provided)
 * @param {boolean} [hideUnsupportedFields=true] - Whether to hide unsupported fields
 */
export function useQuestionnaireInit(formData, schemaType, hideUnsupportedFields = true) {
  const initializedRef = React.useRef(false);
  const ui = useUIApi();
  const formStore = React.useContext(FormStoreContext);
  
  if (!formStore) throw new Error('Missing FormStoreContext.Provider in the tree');
  
  React.useEffect(() => {
    if (initializedRef.current || !formData) return;
    
    try {
      const { data, schemaType: detectedType } = parseAndDetect(formData, schemaType || null);
      const result = adaptSchema(data, detectedType);
      
      if (result.conversionReport) {
        ui.setConversionReport(result.conversionReport);
      }
      
      const defaultSchemaType = 'mieforms-v1.0';
      const schemaObject = {
        schemaType: detectedType === 'surveyjs' 
          ? defaultSchemaType 
          : (data?.schemaType || defaultSchemaType),
        fields: result.fields || []
      };
      
      // Preserve original metadata for SurveyJS schemas
      if (detectedType === 'surveyjs' && result.conversionReport?.surveyMetadata) {
        Object.assign(schemaObject, result.conversionReport.surveyMetadata);
      } else if (detectedType === 'mieforms') {
        // For MIE Forms, preserve any metadata that's not fields or schemaType
        const { fields: _f, schemaType: _st, ...metadata } = data;
        if (Object.keys(metadata).length > 0) {
          Object.assign(schemaObject, metadata);
        }
      }
      
      formStore.getState().replaceAll(schemaObject);
      ui.preview.set(true);
      initializedRef.current = true;
    } catch (error) {
      formStore.getState().replaceAll({ schemaType: 'mieforms-v1.0', fields: [] });
      ui.preview.set(true);
      initializedRef.current = true;
    }
  }, [formData, schemaType, ui, formStore]);

  React.useEffect(() => {
    ui.setHideUnsupportedFields(hideUnsupportedFields);
  }, [hideUnsupportedFields, ui]);
}
