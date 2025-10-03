
export function toFhirAnswers(field) {
  switch (field.fieldType) {
    case 'input':
      return field.answer ? [{ valueString: String(field.answer) }] : [];
    case 'radio':
      return field.selected ? [{ valueString: getOptionValue(field, field.selected) }] : [];
    case 'check':
      return (field.selected || []).map(id => ({ valueString: getOptionValue(field, id) }));
    case 'selection':
      return field.selected ? [{ valueString: getOptionValue(field, field.selected) }] : [];
    default:
      return [];
  }
}

export function getOptionValue(field, optionId) {
  const opt = (field.options || []).find(o => o.id === optionId || o.value === optionId);
  return opt ? opt.value : '';
}

export function buildQuestionnaireResponse(fields, questionnaireId, subjectId) {
  const items = [];
  
  (fields || []).forEach(f => {
    if (f.fieldType === 'section' && Array.isArray(f.fields)) {
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
}
