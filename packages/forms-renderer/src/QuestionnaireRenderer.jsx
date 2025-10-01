import React from 'react';
import { useFormStore, useUIApi, useFieldsArray, getFieldComponent, isVisible } from '@mieweb/forms-engine';
import '@mieweb/forms-engine/styles.css';

/**
 * QuestionnaireRenderer
 * Read-only / answer capture rendering (no editing tools) for a questionnaire definition (fields array)
 */
export function QuestionnaireRenderer({
  fields,
  onChange,
  onSubmit,
  questionnaireId = 'questionnaire-1',
  subjectId,
  className = '',
  fullHeight = false,
}) {
  const initializedRef = React.useRef(false);
  const ui = useUIApi();

  // One-time init with de-duplication of section children mistakenly passed as top-level
  React.useEffect(() => {
    if (initializedRef.current || !Array.isArray(fields)) return;
    const sectionChildIds = new Set();
    fields.forEach(f => {
      if (f?.fieldType === 'section' && Array.isArray(f.fields)) {
        f.fields.forEach(ch => ch?.id && sectionChildIds.add(ch.id));
      }
    });
    const topOnly = fields.filter(f => !sectionChildIds.has(f.id));
    useFormStore.getState().replaceAll(topOnly);
    ui.preview.set(true);
    initializedRef.current = true;
  }, [fields, ui.preview]);


  React.useEffect(() => {
    if (!onChange) return;
    const unsub = useFormStore.subscribe((s) => {
      const arr = s.flatArray ? s.flatArray() : Object.values(s.byId);
      onChange(arr);
    });
    return unsub;
  }, [onChange]);

  const all = useFieldsArray();

  const buildQuestionnaireResponse = React.useCallback(() => {
    const items = [];
    (all || []).forEach(f => {
      if (f.fieldType === 'section' && Array.isArray(f.fields)) {
        // include section children as individual items
        f.fields.forEach(ch => {
          if (!ch) return;
            items.push({
              linkId: ch.id,
              text: ch.question || ch.title || '',
              answer: toFhirAnswers(ch)
            });
        });
        return;
      }
      if (f.fieldType !== 'section') {
        items.push({
          linkId: f.id,
          text: f.question || f.title || '',
          answer: toFhirAnswers(f)
        });
      }
    });
    return {
      resourceType: 'QuestionnaireResponse',
      questionnaire: questionnaireId,
      status: 'in-progress',
      subject: subjectId ? { reference: `Patient/${subjectId}` } : undefined,
      item: items
    };
  }, [all, questionnaireId, subjectId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const qr = buildQuestionnaireResponse();
    onSubmit?.(qr);
  };

  const rootClasses = [
    'qb-render-root',
    'bg-gray-100',
    'font-titillium',
    fullHeight ? 'min-h-screen' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-2 pb-8 pt-4">
        <RendererBody />
        <div className="pt-2">
          <button type="submit" className="px-4 py-2 rounded bg-[#0076a8] text-white shadow hover:bg-[#00628a] transition-colors">Submit</button>
        </div>
      </form>
    </div>
  );
}

function toFhirAnswers(field) {
  switch (field.fieldType) {
    case 'input':
      return field.answer ? [{ valueString: String(field.answer) }] : [];
    case 'radio':
      return field.selected ? [{ valueString: optionValue(field, field.selected) }] : [];
    case 'check':
      return (field.selected || []).map(id => ({ valueString: optionValue(field, id) }));
    case 'selection':
      return field.selected ? [{ valueString: optionValue(field, field.selected) }] : [];
    default:
      return [];
  }
}

function optionValue(field, optionId) {
  const opt = (field.options || []).find(o => o.id === optionId || o.value === optionId);
  return opt ? opt.value : '';
}

function RendererBody() {
  const ui = useUIApi();
  const fields = useFieldsArray() || [];
  const flat = React.useMemo(() => {
    const out = [];
    fields.forEach(f => {
      out.push(f);
      if (f?.fieldType === 'section' && Array.isArray(f.fields)) out.push(...f.fields);
    });
    return out;
  }, [fields]);
  const visible = React.useMemo(() => {
    if (!ui.state.isPreview) return fields;
    return fields.filter(f => isVisible(f, flat));
  }, [fields, flat, ui.state.isPreview]);
  return <div>{visible.map(f => <FieldNode key={f.id} field={f} allFlat={flat} />)}</div>;
}

function FieldNode({ field, allFlat }) {
  const ui = useUIApi();
  const Comp = getFieldComponent(field.fieldType);
  if (!Comp) return null;

  // For sections: filter their child fields by visibility too when in preview
  if (field.fieldType === 'section' && ui.state.isPreview && Array.isArray(field.fields)) {
    const visibleChildren = field.fields.filter(ch => isVisible(ch, allFlat));
    // Shallow clone to avoid mutating original structure; pass filtered set
    const filteredSection = { ...field, fields: visibleChildren };
    return <Comp field={filteredSection} />;
  }

  return <Comp field={field} />;
}
