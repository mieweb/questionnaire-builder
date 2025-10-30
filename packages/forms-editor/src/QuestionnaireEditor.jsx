import React from 'react';
import Header from './components/Header.jsx';
import MobileToolBar from './components/MobileToolBar.jsx';
import Layout from './components/desktopLayout/Layout.jsx';

import {
  useFormStore,
  useUIApi,
  adaptSchema,
  parseAndDetect,
} from '@mieweb/forms-engine';
import './index.css';

/**
 * QuestionnaireEditor - Interactive questionnaire builder/editor
 * @param {string|object} initialFormData - YAML string, JSON string, or form data object
 * @param {string} [schemaType] - Optional: 'mieforms' or 'surveyjs' (auto-detected if not provided)
 * @param {function} [onChange] - Callback fired when form data changes
 * @param {string} [className] - Additional CSS classes
 * @param {boolean} [showHeader=true] - Show editor header
 * @param {boolean} [showMobileToolbar=true] - Show mobile toolbar
 * @param {boolean} [startInPreview=false] - Start in preview mode
 * @param {boolean} [hideUnsupportedFields=false] - Hide unsupported field types
 */
export function QuestionnaireEditor({
  initialFormData,
  schemaType,
  onChange,
  className = '',
  showHeader = true,
  showMobileToolbar = true,
  startInPreview = false,
  hideUnsupportedFields = false,
}) {
  const ui = useUIApi();
  const formStoreInitialized = React.useRef(false);

  React.useEffect(() => {
    if (formStoreInitialized.current) return;
    if (initialFormData) {
      try {
        const { data, schemaType: detectedType } = parseAndDetect(initialFormData, schemaType);
        const result = adaptSchema(data, detectedType);
        
        if (result.conversionReport) {
          ui.setConversionReport(result.conversionReport);
        }
        
        const schemaObject = {
          schemaType: detectedType === 'surveyjs' ? 'mieforms-v1.0' : (data.schemaType || 'mieforms-v1.0'),
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
        
        if (Array.isArray(schemaObject.fields) && schemaObject.fields.length) {
          useFormStore.getState().replaceAll(schemaObject);
        }
      } catch {
        useFormStore.getState().replaceAll({ schemaType: 'mieforms-v1.0', fields: [] });
      }
    }
    ui.preview.set(!!startInPreview);
    formStoreInitialized.current = true;
  }, [initialFormData, schemaType, startInPreview, ui]);

  React.useEffect(() => {
    ui.setHideUnsupportedFields(hideUnsupportedFields);
  }, [hideUnsupportedFields, ui]);

  React.useEffect(() => {
    if (!onChange) return;
    return useFormStore.subscribe((s) => {
      onChange({
        schemaType: s.schemaType || 'mieforms-v1.0',
        ...s.schemaMetadata,
        fields: s.order.map(id => s.byId[id])
      });
    });
  }, [onChange]);

  const selectedField = useFormStore((s) => 
    ui.selectedFieldId.value ? s.byId[ui.selectedFieldId.value] : null
  );

  return (
    <div className={`qb-editor-root min-h-screen bg-gray-100 font-titillium ${className}`}>
      {showHeader && <Header />}
      {showMobileToolbar && <div className="lg:hidden"><MobileToolBar /></div>}
      <Layout selectedField={selectedField} />
    </div>
  );
}
