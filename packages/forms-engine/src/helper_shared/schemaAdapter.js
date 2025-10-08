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
  
  // SurveyJS has 'elements' (single page) or 'pages' (multi-page)
  if (data.elements || data.pages) return 'surveyjs';
  
  // Inhouse format: array of fields or object with fields property
  if (Array.isArray(data) || data.fields) return 'inhouse';
  
  return 'unknown';
}

/**
 * Main adapter entry point
 * @param {any} data - Raw schema data
 * @param {string} schemaType - Explicit schema type ('surveyjs' | 'inhouse')
 * @returns {Array} - Plain field array (formStore will initialize/normalize)
 */
export function adaptSchema(data, schemaType = 'inhouse') {
  if (!data) return [];
  
  switch (schemaType) {
    case 'surveyjs':
      return surveyJSToInhouse(data);
      
    case 'inhouse':
      // Just extract the array - formStore.normalize() handles the rest
      if (Array.isArray(data)) return data;
      if (data.fields && Array.isArray(data.fields)) return data.fields;
      return [];
      
    default:
      throw new Error(`Unsupported schema type: ${schemaType}`);
  }
}

/**
 * Convert SurveyJS schema to inhouse format
 * @param {Object} surveyData - SurveyJS schema
 * @returns {Array} - Inhouse field array
 */
function surveyJSToInhouse(surveyData) {
  if (!surveyData) return [];
  
  // Extract elements (support both single page and multi-page surveys)
  let elements = [];
  if (Array.isArray(surveyData.elements)) {
    elements = surveyData.elements;
  } else if (Array.isArray(surveyData.pages)) {
    // Flatten all pages into single element array
    elements = surveyData.pages.flatMap(page => page.elements || []);
  }
  
  // Convert each element to inhouse field
  return elements.map(convertSurveyElement).filter(Boolean);
}

/**
 * Convert single SurveyJS element to inhouse field
 * @param {Object} element - SurveyJS element
 * @returns {Object|null} - Inhouse field or null if unsupported
 */
function convertSurveyElement(element) {
  if (!element || !element.type) return null;
  
  const fieldType = mapSurveyTypeToInhouse(element.type);
  if (!fieldType) {
    console.warn(`[schemaAdapter] Unsupported SurveyJS type: ${element.type}`);
    return null;
  }
  
  // Base field structure
  const field = {
    id: element.name || `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fieldType,
    question: element.title || element.name || '',
  };
  
  // Add type-specific properties
  switch (fieldType) {
    case 'input':
      field.answer = element.defaultValue || '';
      break;
      
    case 'radio':
    case 'selection':
      field.options = mapSurveyChoices(element.choices);
      field.selected = element.defaultValue || null;
      break;
      
    case 'check':
      field.options = mapSurveyChoices(element.choices);
      field.selected = Array.isArray(element.defaultValue) ? element.defaultValue : [];
      break;
      
    case 'section':
      field.title = element.title || element.name || 'Section';
      field.fields = Array.isArray(element.elements) 
        ? element.elements.map(convertSurveyElement).filter(Boolean)
        : [];
      break;
  }
  
  // Add required flag
  if (element.isRequired) {
    field.required = true;
  }
  
  // TODO: Convert visibleIf to enableWhen (future step)
  
  return field;
}

/**
 * Map SurveyJS field type to inhouse field type
 * @param {string} surveyType - SurveyJS type
 * @returns {string|null} - Inhouse fieldType or null
 */
function mapSurveyTypeToInhouse(surveyType) {
  const typeMap = {
    // Text inputs
    'text': 'input',
    'comment': 'input',
    'multipletext': 'input',
    
    // Single selection
    'radiogroup': 'radio',
    'dropdown': 'selection',
    'boolean': 'radio', // Convert to Yes/No
    
    // Multiple selection
    'checkbox': 'check',
    
    // Containers
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
    // Choice can be string or object
    if (typeof choice === 'string') {
      return {
        id: `opt-${index}`,
        value: choice
      };
    }
    
    // Object format: { value, text } or { value: "key", text: "label" }
    return {
      id: choice.value || `opt-${index}`,
      value: choice.text || choice.value || ''
    };
  });
}
