/**
 * Schema Adapter
 * Converts external form schemas (SurveyJS, etc.) to internal format
 */

/**
 * Detect schema type from raw data
 * @param {any} data - Raw schema data
 * @returns {'surveyjs' | 'inhouse' | 'unknown'}
 */
export function detectSchemaType(data) {
  if (!data) return 'unknown';
  
  if (data.elements || data.pages) return 'surveyjs';
  if (Array.isArray(data) || data.fields) return 'inhouse';
  
  return 'unknown';
}

/**
 * Main adapter entry point
 * @param {any} data - Raw schema data
 * @param {string} schemaType - Explicit schema type ('surveyjs' | 'inhouse')
 * @returns {Object} - { fields: Array, conversionReport: Object }
 */
export function adaptSchema(data, schemaType = 'inhouse') {
  if (!data) return { fields: [], conversionReport: null };
  
  switch (schemaType) {
    case 'surveyjs':
      return surveyJSToInhouse(data);
      
    case 'inhouse':
      const fields = Array.isArray(data) ? data : (data.fields && Array.isArray(data.fields) ? data.fields : []);
      return { fields, conversionReport: null };
      
    default:
      throw new Error(`Unsupported schema type: ${schemaType}`);
  }
}

/**
 * Convert SurveyJS schema to inhouse format
 * @param {Object} surveyData - SurveyJS schema
 * @returns {Object} - { fields: Array, conversionReport: Object }
 */
function surveyJSToInhouse(surveyData) {
  if (!surveyData) return { fields: [], conversionReport: null };
  
  const conversionReport = {
    sourceType: 'surveyjs',
    timestamp: new Date().toISOString(),
    surveyMetadata: extractSurveyMetadata(surveyData),
    totalElements: 0,
    convertedFields: 0,
    droppedFields: [],
    warnings: []
  };
  
  let elements = [];
  if (Array.isArray(surveyData.elements)) {
    elements = surveyData.elements;
  } else if (Array.isArray(surveyData.pages)) {
    elements = surveyData.pages.flatMap(page => page.elements || []);
    
    if (surveyData.pages.length > 1) {
      conversionReport.warnings.push({
        type: 'page_structure_lost',
        message: `Multi-page survey with ${surveyData.pages.length} pages flattened into single form`,
        impact: 'high'
      });
    }
  }
  
  conversionReport.totalElements = elements.length;
  
  const fieldNames = new Set();
  const collectFieldNames = (els) => {
    els.forEach(el => {
      if (el.name) fieldNames.add(el.name);
      if (el.elements && Array.isArray(el.elements)) {
        collectFieldNames(el.elements);
      }
    });
  };
  collectFieldNames(elements);
  
  const fields = elements.map(element => {
    const result = convertSurveyElement(element, fieldNames);
    if (result) {
      conversionReport.convertedFields++;
      if (result._conversionWarnings && result._conversionWarnings.length > 0) {
        conversionReport.warnings.push(...result._conversionWarnings.map(w => ({
          ...w,
          fieldId: result.id,
          fieldName: element.name
        })));
      }
    } else {
      conversionReport.droppedFields.push({
        name: element.name || 'unnamed',
        type: element.type || 'unknown',
        title: element.title || ''
      });
    }
    return result;
  }).filter(Boolean);
  
  // Post-process: resolve option values to IDs in enableWhen conditions
  resolveEnableWhenValues(fields);
  
  return { fields, conversionReport };
}

/**
 * Convert single SurveyJS element to inhouse field
 * @param {Object} element - SurveyJS element
 * @param {Set} fieldNames - Set of valid field names for condition validation
 * @returns {Object|null} - Inhouse field or null if unsupported
 */
function convertSurveyElement(element, fieldNames = new Set()) {
  if (!element || !element.type) return null;
  
  const fieldType = mapSurveyTypeToInhouse(element.type);
  
  const warnings = [];
  
  const field = {
    id: element.name || `field-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    fieldType: fieldType || 'unsupported',
    question: element.title || element.name || '',
    _sourceData: element,
    _conversionWarnings: warnings
  };
  
  if (!fieldType) {
    field.fieldType = 'unsupported';
    field.unsupportedType = element.type;
    
    const unsupportedData = { ...element };
    
    if (unsupportedData.elements && Array.isArray(unsupportedData.elements)) {
      unsupportedData.elements = unsupportedData.elements.map(el => el.name).filter(Boolean);
    }
    
    field.unsupportedData = unsupportedData;
    
    warnings.push({
      type: 'unsupported_field_type',
      property: 'type',
      value: element.type,
      message: `Field type "${element.type}" is not supported. Displayed as placeholder.`,
      impact: 'high'
    });
    
    return field;
  }
  
  switch (fieldType) {
    case 'input':
      field.answer = element.defaultValue || '';
      checkLostInputFeatures(element, warnings);
      break;
      
    case 'radio':
    case 'dropdown':
      field.options = mapSurveyChoices(element.choices);
      field.selected = element.defaultValue || null;
      checkLostChoiceFeatures(element, warnings);
      break;
      
    case 'check':
      field.options = mapSurveyChoices(element.choices);
      field.selected = Array.isArray(element.defaultValue) ? element.defaultValue : [];
      checkLostChoiceFeatures(element, warnings);
      break;
      
    case 'section':
      field.title = element.title || element.name || 'Section';
      field.fields = Array.isArray(element.elements) 
        ? element.elements.map(el => convertSurveyElement(el, fieldNames)).filter(Boolean)
        : [];
      
      if (element.elements && Array.isArray(element.elements)) {
        field._sourceData = {
          ...element,
          elements: element.elements.map(el => el.name).filter(Boolean)
        };
      }
      break;
  }
  
  if (element.type === 'boolean' && field.fieldType === 'radio') {
    field.options = [
      { id: 'yes', value: element.labelTrue || 'Yes' },
      { id: 'no', value: element.labelFalse || 'No' }
    ];
    if (element.defaultValue === true) field.selected = 'yes';
    else if (element.defaultValue === false) field.selected = 'no';
    else field.selected = null;
  }
  
  if (element.isRequired) {
    field.required = true;
  }
  
  if (element.visibleIf) {
    const enableWhen = convertVisibleIfToEnableWhen(element.visibleIf, fieldNames);
    if (enableWhen) {
      field.enableWhen = enableWhen;
      removeWarning(warnings, 'conditional_logic_lost', 'visibleIf');
    }
  }
  
  if (element.enableIf && !field.enableWhen) {
    const enableWhen = convertVisibleIfToEnableWhen(element.enableIf, fieldNames);
    if (enableWhen) {
      field.enableWhen = enableWhen;
      removeWarning(warnings, 'conditional_logic_lost', 'enableIf');
    }
  }
  
  checkLostCommonFeatures(element, warnings);
  
  return field;
}

/**
 * Remove a specific warning from warnings array
 * @param {Array} warnings - Warnings array
 * @param {string} type - Warning type
 * @param {string} property - Warning property
 */
function removeWarning(warnings, type, property) {
  const index = warnings.findIndex(w => w.type === type && w.property === property);
  if (index !== -1) warnings.splice(index, 1);
}

/**
 * Map SurveyJS field type to inhouse field type
 * @param {string} surveyType - SurveyJS type
 * @returns {string|null} - Inhouse fieldType or null
 */
function mapSurveyTypeToInhouse(surveyType) {
  const typeMap = {
    'text': 'input',
    'comment': 'input',
    'multipletext': 'input',
    
    'radiogroup': 'radio',
    'dropdown': 'dropdown',
    'boolean': 'radio',
    
    'checkbox': 'check',
    
    'panel': 'section',
    'paneldynamic': 'section',
  };
  
  return typeMap[surveyType] || null;
}

/**
 * Convert SurveyJS choices to inhouse options format
 * @param {Array} choices - SurveyJS choices array
 * @returns {Array} - Inhouse options array
 */
function mapSurveyChoices(choices) {
  if (!Array.isArray(choices)) return [];
  
  return choices.map((choice, index) => {
    if (typeof choice === 'string') {
      return {
        id: `opt-${index}`,
        value: choice
      };
    }
    
    return {
      id: choice.value || `opt-${index}`,
      value: choice.text || choice.value || ''
    };
  });
}

/**
 * Extract survey-level metadata (will be lost in conversion)
 * @param {Object} surveyData - SurveyJS schema
 * @returns {Object} - Extracted metadata
 */
function extractSurveyMetadata(surveyData) {
  const metadata = {};
  
  const metadataProps = [
    'title', 'description', 'logo', 'logoPosition',
    'showProgressBar', 'progressBarType', 'showQuestionNumbers',
    'completedHtml', 'loadingHtml', 'locale', 'questionsOnPageMode',
    'calculatedValues', 'triggers'
  ];
  
  metadataProps.forEach(prop => {
    if (surveyData[prop] !== undefined) {
      metadata[prop] = surveyData[prop];
    }
  });
  
  return metadata;
}

/**
 * Check for lost input-specific features
 * @param {Object} element - SurveyJS element
 * @param {Array} warnings - Warnings array to populate
 */
function checkLostInputFeatures(element, warnings) {
  if (element.inputType && element.inputType !== 'text') {
    warnings.push({
      type: 'input_type_lost',
      property: 'inputType',
      value: element.inputType,
      message: `Input type "${element.inputType}" not supported (date, tel, email, number will render as text)`,
      impact: 'medium'
    });
  }
  
  if (element.placeHolder) {
    warnings.push({
      type: 'placeholder_lost',
      property: 'placeHolder',
      value: element.placeHolder,
      message: 'Placeholder text not supported',
      impact: 'low'
    });
  }
  
  if (element.maxLength) {
    warnings.push({
      type: 'validation_lost',
      property: 'maxLength',
      value: element.maxLength,
      message: 'Max length validation not supported',
      impact: 'medium'
    });
  }
  
  if (element.min !== undefined || element.max !== undefined) {
    warnings.push({
      type: 'validation_lost',
      property: 'min/max',
      value: `${element.min || ''} - ${element.max || ''}`,
      message: 'Numeric min/max constraints not supported',
      impact: 'high'
    });
  }
}

/**
 * Check for lost choice-specific features
 * @param {Object} element - SurveyJS element
 * @param {Array} warnings - Warnings array to populate
 */
function checkLostChoiceFeatures(element, warnings) {
  if (element.hasOther) {
    warnings.push({
      type: 'other_option_lost',
      property: 'hasOther',
      value: element.otherText || 'Other',
      message: '"Other" option with text input not supported',
      impact: 'medium'
    });
  }
  
  if (element.labelTrue || element.labelFalse) {
    warnings.push({
      type: 'boolean_labels_lost',
      property: 'labelTrue/labelFalse',
      value: `${element.labelTrue || 'Yes'} / ${element.labelFalse || 'No'}`,
      message: 'Custom boolean labels not supported (using Yes/No)',
      impact: 'low'
    });
  }
  
  if (element.choicesOrder && element.choicesOrder !== 'none') {
    warnings.push({
      type: 'choice_order_lost',
      property: 'choicesOrder',
      value: element.choicesOrder,
      message: 'Choice ordering not supported',
      impact: 'low'
    });
  }
}

/**
 * Check for lost common features
 * @param {Object} element - SurveyJS element
 * @param {Array} warnings - Warnings array to populate
 */
function checkLostCommonFeatures(element, warnings) {
  if (element.visibleIf) {
    warnings.push({
      type: 'conditional_logic_lost',
      property: 'visibleIf',
      value: element.visibleIf,
      message: 'Conditional visibility logic not supported (field always visible)',
      impact: 'high'
    });
  }
  
  if (element.enableIf) {
    warnings.push({
      type: 'conditional_logic_lost',
      property: 'enableIf',
      value: element.enableIf,
      message: 'Conditional enable/disable logic not supported',
      impact: 'high'
    });
  }
  
  if (element.requiredIf) {
    warnings.push({
      type: 'conditional_logic_lost',
      property: 'requiredIf',
      value: element.requiredIf,
      message: 'Conditional required logic not supported',
      impact: 'high'
    });
  }
  
  if (element.validators && element.validators.length > 0) {
    warnings.push({
      type: 'validation_lost',
      property: 'validators',
      value: element.validators.map(v => v.type).join(', '),
      message: `Validators not supported: ${element.validators.map(v => v.type).join(', ')}`,
      impact: 'high'
    });
  }
  
  if (element.readOnly) {
    warnings.push({
      type: 'readonly_lost',
      property: 'readOnly',
      value: true,
      message: 'Read-only field not supported',
      impact: 'medium'
    });
  }
}

/**
 * Convert SurveyJS visibleIf/enableIf expression to inhouse enableWhen format
 * @param {string} expression - SurveyJS expression (e.g., "{consent} = true")
 * @param {Set} fieldNames - Set of valid field names (excludes calculated values)
 * @returns {Object|null} - enableWhen object or null if unable to convert
 * 
 * Supported formats:
 * - Simple equality: {fieldName} = value
 * - Simple equality with quotes: {fieldName} = 'value'
 * - Boolean: {fieldName} = true|false
 * - Multiple AND: {field1} = value1 and {field2} = value2
 * - Multiple OR: {field1} = value1 or {field2} = value2
 * - Not equal: {fieldName} <> value or {fieldName} != value
 * - Contains (for strings): {fieldName} contains value
 * 
 * Note: Conditions referencing calculated values or non-existent fields are filtered out
 */
function convertVisibleIfToEnableWhen(expression, fieldNames = new Set()) {
  if (!expression || typeof expression !== 'string') return null;
  
  try {
    let expr = expression.trim();
    
    let logic = 'AND';
    const hasOr = / or /i.test(expr);
    const hasAnd = / and /i.test(expr);
    
    if (hasOr && hasAnd) {
      console.warn(`[schemaAdapter] Mixed AND/OR logic not supported in: ${expression}`);
      return null;
    }
    
    if (hasOr) logic = 'OR';
    
    const parts = expr.split(hasOr ? / or /i : / and /i);
    const conditions = [];
    
    for (const part of parts) {
      const condition = parseCondition(part.trim());
      if (condition) {
        if (fieldNames.size > 0 && !fieldNames.has(condition.targetId)) {
          console.warn(`[schemaAdapter] Skipping condition - field "${condition.targetId}" not found (may be calculated value or metadata): ${part}`);
          continue;
        }
        conditions.push(condition);
      } else {
        console.warn(`[schemaAdapter] Unable to parse condition: ${part}`);
      }
    }
    
    if (conditions.length === 0) return null;
    
    return {
      logic: conditions.length === 1 ? 'AND' : logic,
      conditions
    };
  } catch (error) {
    console.warn(`[schemaAdapter] Error converting visibleIf: ${expression}`, error);
    return null;
  }
}

/**
 * Parse a single condition from SurveyJS expression
 * @param {string} condition - Single condition (e.g., "{consent} = true")
 * @returns {Object|null} - Condition object or null
 */
function parseCondition(condition) {
  const matchPattern = (pattern) => condition.match(pattern);
  
  let match = matchPattern(/\{(\w+)\}\s*=\s*'([^']+)'/) || 
              matchPattern(/\{(\w+)\}\s*=\s*"([^"]+)"/) ||
              matchPattern(/\{(\w+)\}\s*=\s*([\w.-]+)/);
  
  if (match) {
    const value = match[2];
    const normalizedValue = value === 'true' ? 'yes' : value === 'false' ? 'no' : value;
    return { targetId: match[1], operator: 'equals', value: normalizedValue };
  }
  
  match = matchPattern(/\{(\w+)\}\s*(?:<>|!=)\s*'([^']+)'/) ||
          matchPattern(/\{(\w+)\}\s*(?:<>|!=)\s*"([^"]+)"/) ||
          matchPattern(/\{(\w+)\}\s*(?:<>|!=)\s*([\w.-]+)/);
  
  if (match) {
    console.warn(`[schemaAdapter] "not equal" operator not yet supported: ${condition}`);
    return null;
  }
  
  match = matchPattern(/\{(\w+)\}\s+contains\s+'([^']+)'/) ||
          matchPattern(/\{(\w+)\}\s+contains\s+"([^"]+)"/) ||
          matchPattern(/\{(\w+)\}\s+contains\s+([\w.-]+)/);
  
  if (match) {
    return { targetId: match[1], operator: 'contains', value: match[2] };
  }
  
  match = matchPattern(/\{(\w+)\}\s+empty/i);
  if (match) return { targetId: match[1], operator: 'equals', value: '' };
  
  match = matchPattern(/\{(\w+)\}\s+notempty/i);
  if (match) {
    console.warn(`[schemaAdapter] "notempty" operator not yet supported: ${condition}`);
    return null;
  }
  
  return null;
}

/**
 * Build a field lookup map for quick access by ID
 * @param {Array} fields - Array of fields (including nested sections)
 * @returns {Map} - Map of fieldId -> field
 */
function buildFieldMap(fields) {
  const fieldMap = new Map();
  
  const addToMap = (fieldList) => {
    fieldList.forEach(field => {
      fieldMap.set(field.id, field);
      if (field.fields && Array.isArray(field.fields)) {
        addToMap(field.fields);
      }
    });
  };
  
  addToMap(fields);
  return fieldMap;
}

/**
 * Resolve option values to IDs in enableWhen conditions
 * @param {Array} fields - Array of fields to process
 */
function resolveEnableWhenValues(fields) {
  const fieldMap = buildFieldMap(fields);
  
  const processField = (field) => {
    if (field.enableWhen && field.enableWhen.conditions) {
      field.enableWhen.conditions.forEach(condition => {
        const targetField = fieldMap.get(condition.targetId);
        
        if (targetField && targetField.options && Array.isArray(targetField.options)) {
          // For radio/dropdown/check fields with options, map value to option ID
          const matchingOption = targetField.options.find(opt => opt.value === condition.value);
          
          if (matchingOption) {
            condition.value = matchingOption.id;
          } else {
            console.warn(`[schemaAdapter] No matching option found for value "${condition.value}" in field "${condition.targetId}"`);
          }
        }
        // For other field types (input, etc.), keep the value as-is
      });
    }
    
    // Recursively process nested fields (sections)
    if (field.fields && Array.isArray(field.fields)) {
      field.fields.forEach(processField);
    }
  };
  
  fields.forEach(processField);
}
