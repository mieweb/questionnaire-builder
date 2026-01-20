import React from 'react';
import Header from './components/Header.jsx';
import Layout from './components/desktopLayout/Layout.jsx';

import {
  FormStoreContext,
  UIStoreContext,
  createFormStore,
  createUIStore,
  useUIApi,
  adaptSchema,
  parseAndDetect,
  AlertProvider,
} from '@mieweb/forms-engine';
import { useStore } from 'zustand';
import './index.css';

/**
 * QuestionnaireEditor - Interactive questionnaire builder/editor
 * @param {string|object} initialFormData - YAML string, JSON string, or form data object
 * @param {string} [schemaType] - Optional: 'mieforms' or 'surveyjs' (auto-detected if not provided)
 * @param {function} [onChange] - Callback fired when form data changes
 * @param {string} [className] - Additional CSS classes
 * @param {boolean} [showHeader=true] - Show editor header
 * @param {boolean} [startInPreview=false] - Start in preview mode
 * @param {boolean} [hideUnsupportedFields=false] - Hide unsupported field types
 * @param {'light'|'dark'|'auto'} [theme='auto'] - Theme: 'light', 'dark', or 'auto' (detects from parent)
 */
function QuestionnaireEditorInner({
  initialFormData,
  schemaType,
  onChange,
  className = '',
  showHeader = true,
  startInPreview = false,
  hideUnsupportedFields = false,
  theme = 'auto',
}) {
  const [codeFormat, setCodeFormat] = React.useState("json");
  const ui = useUIApi();
  const formStoreInitialized = React.useRef(false);
  const formStore = React.useContext(FormStoreContext);

  React.useEffect(() => {
    if (formStoreInitialized.current || !formStore) return;
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
          formStore.getState().replaceAll(schemaObject);
        }
      } catch {
        formStore.getState().replaceAll({ schemaType: 'mieforms-v1.0', fields: [] });
      }
    }
    ui.preview.set(!!startInPreview);
    formStoreInitialized.current = true;
  }, [initialFormData, schemaType, startInPreview, ui, formStore]);

  React.useEffect(() => {
    ui.setHideUnsupportedFields(hideUnsupportedFields);
  }, [hideUnsupportedFields, ui]);

  React.useEffect(() => {
    if (!onChange || !formStore) return;
    return formStore.subscribe((s) => {
      onChange({
        schemaType: s.schemaType || 'mieforms-v1.0',
        ...s.schemaMetadata,
        fields: s.order.map(id => s.byId[id])
      });
    });
  }, [onChange, formStore]);

  const selectedField = useStore(formStore, (s) => 
    ui.selectedFieldId.value ? s.byId[ui.selectedFieldId.value] : null
  );

  // Theme detection
  const [isDark, setIsDark] = React.useState(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    // Auto-detect from document
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') === 'dark' ||
             document.documentElement.classList.contains('dark') ||
             document.body.classList.contains('dark');
    }
    return false;
  });

  React.useEffect(() => {
    if (theme !== 'auto') {
      setIsDark(theme === 'dark');
      return;
    }
    // Watch for theme changes (Docusaurus, etc.)
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                   document.documentElement.classList.contains('dark') ||
                   document.body.classList.contains('dark');
      setIsDark(dark);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [theme]);

  return (
    <div className={`qb-editor-root editor-container mie:w-full mie:max-w-7xl mie:mx-auto mie:bg-miebackground mie:font-titillium ${isDark ? 'dark' : ''} ${className}`}>
      <AlertProvider>
        {showHeader && <Header codeFormat={codeFormat} onCodeFormatChange={setCodeFormat} />}
        <Layout selectedField={selectedField} codeFormat={codeFormat} />
      </AlertProvider>
    </div>
  );
}

export function QuestionnaireEditor(props) {
  const formStore = React.useRef(createFormStore()).current;
  const uiStore = React.useRef(createUIStore()).current;

  return (
    <FormStoreContext.Provider value={formStore}>
      <UIStoreContext.Provider value={uiStore}>
        <QuestionnaireEditorInner {...props} />
      </UIStoreContext.Provider>
    </FormStoreContext.Provider>
  );
}
