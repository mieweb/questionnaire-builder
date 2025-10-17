import React, { useEffect, useRef } from 'react';
import Header from './components/Header.jsx';
import MobileToolBar from './components/MobileToolBar.jsx';
import Layout from './components/desktopLayout/Layout.jsx';

import {
  useFormStore,
  useFormApi,
  useUIApi,
  useFieldsArray,
} from '@mieweb/forms-engine';
import './index.css';

export function QuestionnaireEditor({
  initialFields,
  onChange,
  className = '',
  showHeader = true,
  showMobileToolbar = true,
  startInPreview = false,
}) {
  const ui = useUIApi();
  const formStoreInitialized = useRef(false);

  useEffect(() => {
    if (formStoreInitialized.current) return;
    if (Array.isArray(initialFields) && initialFields.length) {
      useFormStore.getState().replaceAll(initialFields);
    }
    ui.preview.set(!!startInPreview);
    formStoreInitialized.current = true;
  }, [initialFields, startInPreview, ui.preview]);

  useEffect(() => {
    if (!onChange) return;
    const unsub = useFormStore.subscribe((s) => {
      const arr = [];
      s.order.forEach(id => {
        const f = s.byId[id];
        if (f) {
          arr.push(f);
          if (f.fieldType === "section" && Array.isArray(f.fields)) {
            arr.push(...f.fields);
          }
        }
      });
      onChange(arr);
    });
    return unsub;
  }, [onChange]);

  const selectedField = useFormStore(
    React.useCallback(
      (s) => (ui.selectedFieldId.value ? s.byId[ui.selectedFieldId.value] : null),
      [ui.selectedFieldId.value]
    )
  );

  return (
    <div className={`qb-editor-root min-h-screen bg-gray-100 font-titillium ${className}`}>
      {showHeader && <Header />}
      {showMobileToolbar && <div className="lg:hidden"><MobileToolBar /></div>}
      <Layout selectedField={selectedField} />
    </div>
  );
}
