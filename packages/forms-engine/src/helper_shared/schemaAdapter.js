/**
 * Current MIE Forms schema type identifier
 * Similar to FHIR resourceType field
 */
export const MIE_FORMS_SCHEMA_TYPE = 'mieforms-v1.0';

export function detectSchemaType(data) {
  if (!data) return 'unknown';
  
  // Check for MIE Forms metadata (must be explicit)
  // Similar to FHIR resourceType pattern
  if (data.schemaType && data.schemaType.startsWith('mieforms-v')) {
    return 'mieforms';
  }
  
  // Check for SurveyJS schema markers (pages array with name or elements)
  if (Array.isArray(data.pages) && data.pages.some(p => p.name || p.elements)) {
    return 'surveyjs';
  }
  
  return 'unknown';
}

export function adaptSchema(data, schemaType = 'mieforms') {
  if (!data) return { fields: [], conversionReport: null };
  
  switch (schemaType) {
    case 'surveyjs':
      return surveyJSToMIEForms(data);
      
    case 'mieforms':
      const { fields = [], schemaType: _st, ...metadata } = data;
      return { 
        fields, 
        conversionReport: Object.keys(metadata).length > 0 ? {
          sourceType: 'mieforms',
          surveyMetadata: metadata
        } : null 
      };
      
    default:
      throw new Error(`Unsupported schema type: ${schemaType}. MIE Forms data must include schemaType field starting with 'mieforms-v'`);
  }
}

function surveyJSToMIEForms(surveyData) {
  if (!surveyData) return { fields: [], conversionReport: null };
  
  const conversionReport = {
    sourceType: 'surveyjs',
    timestamp: new Date().toISOString(),
    surveyMetadata: extractSurveyMetadata(surveyData),
    totalElements: 0,
    convertedFields: 0,
    unsupportedFields: [],
    warnings: []
  };
  
  // SurveyJS always has pages array, elements are nested inside pages
  let elements = [];
  if (Array.isArray(surveyData.pages)) {
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
  
  // Helper to recursively count fields
  const countFields = (field) => {
    if (!field) return { converted: 0, unsupported: 0 };
    
    let converted = 0;
    let unsupported = 0;
    
    if (field.unsupportedType) {
      unsupported++;
    } else if (field.fieldType !== 'section') {
      converted++;
    }
    
    // Recursively count nested fields in sections
    if (field.fields && Array.isArray(field.fields)) {
      field.fields.forEach(child => {
        const childCounts = countFields(child);
        converted += childCounts.converted;
        unsupported += childCounts.unsupported;
      });
    }
    
    return { converted, unsupported };
  };
  
  const fields = elements.map(element => {
    const result = convertSurveyElement(element, fieldNames);
    if (result) {
      // Recursively count all fields including nested ones
      const counts = countFields(result);
      conversionReport.convertedFields += counts.converted;
      
      if (counts.unsupported > 0 || result.unsupportedType) {
        // Add to unsupported list
        const addUnsupported = (field, elementData) => {
          if (field.unsupportedType) {
            conversionReport.unsupportedFields.push({
              name: elementData.name || 'unnamed',
              type: elementData.type || 'unknown',
              title: elementData.title || ''
            });
          }
          if (field.fields && Array.isArray(field.fields)) {
            field.fields.forEach((child, idx) => {
              const childElement = elementData.elements?.[idx] || {};
              addUnsupported(child, childElement);
            });
          }
        };
        addUnsupported(result, element);
      }
      
      if (result._conversionWarnings && result._conversionWarnings.length > 0) {
        conversionReport.warnings.push(...result._conversionWarnings.map(w => ({
          ...w,
          fieldId: result.id,
          fieldName: element.name
        })));
      }
    }
    return result;
  }).filter(Boolean);
  
  // Post-process: resolve option values to IDs in enableWhen conditions
  resolveEnableWhenValues(fields);
  
  return { fields, conversionReport };
}

function convertSurveyElement(element, fieldNames = new Set()) {
  if (!element || !element.type) return null;
  
  const fieldType = mapSurveyTypeToMIEForms(element.type);
  
  const warnings = [];
  
  const field = {
    id: element.name || `field-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    fieldType: fieldType || 'unsupported',
    question: element.title || element.name || '',
  };
  
  if (!fieldType) {
    field.fieldType = 'unsupported';
    field.unsupportedType = element.type;
    
    const unsupportedData = { ...element };
    
    if (unsupportedData.elements && Array.isArray(unsupportedData.elements)) {
      unsupportedData.elements = unsupportedData.elements.map(el => el.name).filter(Boolean);
    }
    
    field.unsupportedData = unsupportedData;
    
    return field;
  }
  
  switch (fieldType) {
    case 'text':
      field.answer = element.defaultValue || '';
      
      // Map SurveyJS inputType to our inputType
      if (element.inputType) {
        const inputTypeMap = {
          'number': 'number',
          'email': 'email',
          'tel': 'tel',
          'date': 'date',
          'datetime': 'datetime-local',
          'datetime-local': 'datetime-local',
          'month': 'month',
          'time': 'time',
          'range': 'range'
        };
        field.inputType = inputTypeMap[element.inputType] || 'text';
      } else {
        field.inputType = 'text';
      }
      
      // Map unit if present (SurveyJS doesn't have standard unit support, but some custom implementations might)
      if (element.unit) {
        field.unit = element.unit;
      }
      
      checkLostInputFeatures(element, warnings);
      break;
      
    case 'longtext':
      field.answer = element.defaultValue || '';
      field.inputType = 'text'; // Longtext is always text type
      checkLostInputFeatures(element, warnings);
      break;
      
    case 'multitext':
      // SurveyJS multipletext has items array with name/title
      field.options = Array.isArray(element.items)
        ? element.items.map((item, idx) => ({
            id: item.name || `item-${idx}`,
            value: item.title || item.name || `Item ${idx + 1}`
          }))
        : [{ id: 'item-1', value: 'Item 1' }];
      break;
      
    case 'radio':
    case 'dropdown':
      field.options = mapSurveyChoices(element.choices);
      field.selected = element.defaultValue || null;
      checkLostChoiceFeatures(element, warnings);
      break;
      
    case 'boolean':
      field.options = [
        { id: 'yes', value: element.labelTrue || 'Yes' },
        { id: 'no', value: element.labelFalse || 'No' }
      ];
      if (element.defaultValue === true || element.defaultValue === 'true') {
        field.selected = 'yes';
      } else if (element.defaultValue === false || element.defaultValue === 'false') {
        field.selected = 'no';
      } else {
        field.selected = null;
      }
      break;
      
    case 'check':
    case 'multiselectdropdown':
      field.options = mapSurveyChoices(element.choices);
      field.selected = Array.isArray(element.defaultValue) ? element.defaultValue : [];
      checkLostChoiceFeatures(element, warnings);
      break;
      
    case 'rating':
      // Convert SurveyJS rating (rateMin/rateMax) to options array
      field.options = mapRatingToOptions(element);
      // Don't set selected from defaultValue - that's a form behavior, not initial data
      field.selected = null;
      break;
      
    case 'ranking':
      field.options = mapSurveyChoices(element.choices);
      field.selected = Array.isArray(element.defaultValue) ? element.defaultValue : [];
      break;
      
    case 'singlematrix':
      field.rows = mapSurveyChoices(element.rows);
      field.columns = mapSurveyChoices(element.columns);
      field.selected = element.defaultValue || {};
      break;
      
    case 'multimatrix':
      field.rows = mapSurveyChoices(element.rows);
      field.columns = mapSurveyChoices(element.columns);
      field.selected = element.defaultValue || {};
      break;
      
    case 'html':
      field.htmlContent = element.html || '';
      break;
      
    case 'image':
      field.label = element.title || element.name || '';
      field.imageUri = element.imageLink || '';
      field.altText = element.altText || element.title || '';
      field.size = 'full';
      field.alignment = 'center';
      field.padding = 'padded';
      break;
      
    case 'signature':
      field.placeholder = element.placeholder || 'Sign here';
      field.signatureData = '';
      field.signatureImage = '';
      break;
      
    case 'expression':
      field.label = element.title || element.name || 'Calculated Result';
      const conversionResult = convertSurveyJSExpression(element.expression || '');
      field.expression = conversionResult.expression;
      
      // Check if expression contains unsupported functions
      const hasUnsupportedFunctions = conversionResult.warnings.some(
        w => w.type === 'expression_function_unsupported'
      );
      
      if (hasUnsupportedFunctions) {
        // Mark as unsupported field
        field.fieldType = 'unsupported';
        field.unsupportedType = 'expression';
        field.unsupportedData = {
          ...element,
          reason: 'Expression contains unsupported functions: ' + 
            conversionResult.warnings
              .filter(w => w.type === 'expression_function_unsupported')
              .map(w => w.value)
              .join(', ')
        };
      } else {
        // Use displayStyle from SurveyJS if provided, otherwise auto-detect
        const supportedFormats = ['number', 'currency', 'percentage', 'boolean', 'string'];
        if (element.displayStyle) {
          field.displayFormat = supportedFormats.includes(element.displayStyle) 
            ? element.displayStyle 
            : 'string';
        } else {
          field.displayFormat = conversionResult.isStringExpression ? 'string' : 'number';
        }
        field.decimalPlaces = 2;
        field.sampleDataFields = [];
        field.answer = '';
      }
      
      // Add warnings for lost expression features
      if (conversionResult.warnings.length > 0) {
        warnings.push(...conversionResult.warnings);
      }
      break;
      
    case 'section':
      field.title = element.title || element.name || 'Section';
      field.fields = Array.isArray(element.elements) 
        ? element.elements.map(el => convertSurveyElement(el, fieldNames)).filter(Boolean)
        : [];
      break;
  }
  
  if (element.isRequired) {
    field.required = true;
  }
  
  // Try to convert visibleIf first
  let visibleIfConverted = false;
  if (element.visibleIf) {
    const enableWhen = convertVisibleIfToEnableWhen(element.visibleIf, fieldNames);
    if (enableWhen) {
      field.enableWhen = enableWhen;
      visibleIfConverted = true;
    }
  }
  
  // If visibleIf wasn't converted, try enableIf
  let enableIfConverted = false;
  if (element.enableIf && !field.enableWhen) {
    const enableWhen = convertVisibleIfToEnableWhen(element.enableIf, fieldNames);
    if (enableWhen) {
      field.enableWhen = enableWhen;
      enableIfConverted = true;
    }
  }
  
  // Only add warnings for features that were NOT successfully converted
  checkLostCommonFeatures(element, warnings, visibleIfConverted, enableIfConverted);
  
  // Add metadata properties at the end
  // For sections, store a simplified version of sourceData with element names instead of full objects
  if (field.fieldType === 'section' && element.elements && Array.isArray(element.elements)) {
    field._sourceData = {
      ...element,
      elements: element.elements.map(el => el.name).filter(Boolean)
    };
  } else {
    field._sourceData = element;
  }
  field._conversionWarnings = warnings;
  
  return field;
}

function mapSurveyTypeToMIEForms(surveyType) {
  const typeMap = {
    // Text inputs
    'text': 'text',
    'comment': 'longtext',        // Multi-line text area
    'multipletext': 'multitext',  // Multiple text inputs
    
    // Single choice
    'radiogroup': 'radio',
    'buttongroup': 'radio',       // Button-style radio group
    'dropdown': 'dropdown',
    'boolean': 'boolean',         // Yes/No field
    
    // Multiple choice
    'checkbox': 'check',
    'tagbox': 'multiselectdropdown',  // Multi-select dropdown
    
    // Rating & Ranking
    'rating': 'rating',           // Star/number rating
    'ranking': 'ranking',         // Drag-and-drop ranking
    
    // Matrix fields
    'matrix': 'singlematrix',     // Single-select matrix (radio per row)
    'matrixdropdown': 'multimatrix',  // Multi-select matrix (checkbox per row)
    'matrixdynamic': 'multimatrix',   // Dynamic matrix
    
    // Containers
    'panel': 'section',
    'paneldynamic': 'section',
    
    // Rich Content
    'html': 'html',               // HTML display block
    'image': 'image',             // Image display
    'signaturepad': 'signature',  // Signature pad
    'expression': 'expression',   // Calculated field
    
    // Unsupported
    'file': null,                 // File upload not supported
    'imagepicker': null,          // Image picker not supported
  };
  
  return typeMap[surveyType] || null;
}

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

function mapRatingToOptions(element) {
  // SurveyJS rating uses rateMin/rateMax (defaults 1-5)
  const min = element.rateMin !== undefined ? element.rateMin : 1;
  const max = element.rateMax !== undefined ? element.rateMax : 5;
  const step = element.rateStep || 1;
  
  const options = [];
  for (let i = min; i <= max; i += step) {
    options.push({ 
      id: `${element.name}-option-${options.length}`,  // Unique ID for selection
      text: String(i),  // Display text
      value: i          // Actual numeric value for comparisons
    });
  }
  
  return options.length > 0 ? options : [
    { id: 'rating-1', text: '1', value: 1 },
    { id: 'rating-2', text: '2', value: 2 },
    { id: 'rating-3', text: '3', value: 3 },
    { id: 'rating-4', text: '4', value: 4 },
    { id: 'rating-5', text: '5', value: 5 }
  ];
}

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

function convertSurveyJSExpression(expression) {
  if (!expression) return { expression: '', warnings: [], isStringExpression: false };
  
  const warnings = [];
  let converted = expression;
  
  // Check if this is a string concatenation expression
  const hasQuotes = converted.includes("'") || converted.includes('"');
  const isStringExpression = hasQuotes;
  
  // 1. Convert iif(condition, trueVal, falseVal) → if condition then trueVal else falseVal
  // Handle nested iif() by processing innermost first (recursive approach)
  const convertIif = (expr) => {
    // Find iif( and match its arguments with proper parenthesis/quote balancing
    const iifStart = expr.toLowerCase().indexOf('iif(');
    if (iifStart === -1) return expr;
    
    // Find the matching closing parenthesis
    let depth = 0;
    let inQuote = null;
    let argStart = iifStart + 4; // After 'iif('
    const args = [];
    let currentArg = '';
    let iifEnd = -1;
    
    for (let i = argStart; i < expr.length; i++) {
      const char = expr[i];
      
      // Handle quotes
      if ((char === "'" || char === '"') && expr[i - 1] !== '\\') {
        if (!inQuote) inQuote = char;
        else if (inQuote === char) inQuote = null;
        currentArg += char;
        continue;
      }
      
      if (inQuote) {
        currentArg += char;
        continue;
      }
      
      // Handle parentheses
      if (char === '(') {
        depth++;
        currentArg += char;
      } else if (char === ')') {
        if (depth === 0) {
          // End of iif()
          args.push(currentArg.trim());
          iifEnd = i + 1; // Position after the closing )
          break;
        }
        depth--;
        currentArg += char;
      } else if (char === ',' && depth === 0) {
        args.push(currentArg.trim());
        currentArg = '';
      } else {
        currentArg += char;
      }
    }
    
    if (args.length === 3 && iifEnd !== -1) {
      const [condition, trueVal, falseVal] = args;
      // Recursively convert nested iif in each part
      const convertedCond = convertIif(condition);
      const convertedTrue = convertIif(trueVal);
      const convertedFalse = convertIif(falseVal);
      
      const replacement = `if ${convertedCond} then ${convertedTrue} else ${convertedFalse}`;
      
      // Replace the original iif(...) with the converted version
      const before = expr.substring(0, iifStart);
      const after = expr.substring(iifEnd);
      
      // Continue converting any remaining iif() in the expression
      return convertIif(before + replacement + after);
    }
    
    return expr;
  };
  
  converted = convertIif(converted);
  
  // 2. Convert logical operators (must be word-bounded to avoid matching within words)
  converted = converted.replace(/\band\b/gi, '&&');
  converted = converted.replace(/\bor\b/gi, '||');
  
  // 3. Convert single = to == for equality (but not <=, >=, !=, ==)
  // Match = that is not preceded by <, >, !, = and not followed by =
  converted = converted.replace(/(?<![<>=!])=(?!=)/g, '==');
  
  // 3b. Convert string literals in comparisons to bracket syntax
  // Pattern: ==|!=|<|>|<=|>= followed by optional spaces and 'text' or "text"
  // Convert to [text] to distinguish from concatenation strings
  converted = converted.replace(/(==|!=|<|>|<=|>=)\s*(['"])([^'"]+)\2/g, '$1 [$3]');
  // Also handle the reverse: 'text' followed by comparison operator
  converted = converted.replace(/(['"])([^'"]+)\1\s*(==|!=|<|>|<=|>=)/g, '[$2] $3');
  
  // 4. Convert notempty operator: {field} notempty → {field} != []
  converted = converted.replace(/(\{[^}]+\})\s+notempty\b/gi, "$1 != []");
  
  // 5. Convert empty operator: {field} empty → {field} == []
  converted = converted.replace(/(\{[^}]+\})\s+empty\b/gi, "$1 == []");
  
  // 6. Convert escape sequences - \n to <nl> for newlines, \t to space, \r removed
  converted = converted.replace(/\\n/g, '<nl>');
  converted = converted.replace(/\\t/g, ' ');
  converted = converted.replace(/\\r/g, '');
  
  // 7. Strip trim() wrapper - just use the inner content
  // Pattern: trim(expression) → expression (handles nested content with balanced parens)
  const stripTrim = (expr) => {
    const trimMatch = expr.match(/\btrim\s*\(/i);
    if (!trimMatch) return expr;
    
    const start = trimMatch.index;
    const argStart = start + trimMatch[0].length;
    let depth = 1;
    let inQuote = null;
    let i = argStart;
    
    for (; i < expr.length && depth > 0; i++) {
      const char = expr[i];
      if ((char === "'" || char === '"') && expr[i - 1] !== '\\') {
        if (!inQuote) inQuote = char;
        else if (inQuote === char) inQuote = null;
        continue;
      }
      if (inQuote) continue;
      if (char === '(') depth++;
      else if (char === ')') depth--;
    }
    
    const inner = expr.substring(argStart, i - 1);
    const before = expr.substring(0, start);
    const after = expr.substring(i);
    
    // Recursively strip any remaining trim() calls
    return stripTrim(before + inner + after);
  };
  converted = stripTrim(converted);
  
  // 8. Check for unsupported functions and warn
  const unsupportedFunctions = [
    { pattern: /\bage\s*\(/i, name: 'age()' },
    { pattern: /\btoday\s*\(/i, name: 'today()' },
    { pattern: /\byearDiff\s*\(/i, name: 'yearDiff()' },
    { pattern: /\bmonthDiff\s*\(/i, name: 'monthDiff()' },
    { pattern: /\bdayDiff\s*\(/i, name: 'dayDiff()' },
    { pattern: /\bround\s*\(/i, name: 'round()' },
    { pattern: /\bpow\s*\(/i, name: 'pow()' },
    { pattern: /\babs\s*\(/i, name: 'abs()' },
    { pattern: /\bmin\s*\(/i, name: 'min()' },
    { pattern: /\bmax\s*\(/i, name: 'max()' },
    { pattern: /\bsum\s*\(/i, name: 'sum()' },
    { pattern: /\bavg\s*\(/i, name: 'avg()' },
    { pattern: /\bcount\s*\(/i, name: 'count()' },
    { pattern: /\bcontains\s*\(/i, name: 'contains()' },
    { pattern: /\bisNaN\s*\(/i, name: 'isNaN()' },
    { pattern: /\bcoalesce\s*\(/i, name: 'coalesce()' },
    { pattern: /\bupper\s*\(/i, name: 'upper()' },
    { pattern: /\blower\s*\(/i, name: 'lower()' },
    { pattern: /\bsubstring\s*\(/i, name: 'substring()' },
  ];
  
  unsupportedFunctions.forEach(({ pattern, name }) => {
    if (pattern.test(converted)) {
      warnings.push({
        type: 'expression_function_unsupported',
        property: 'expression',
        value: name,
        message: `Function ${name} not yet supported in MIE Forms - expression may not evaluate correctly`,
        impact: 'high'
      });
    }
  });
  
  return { expression: converted.trim(), warnings, isStringExpression };
}

function checkLostInputFeatures(element, warnings) {
  // We now support these inputTypes, so only warn for unsupported ones
  const supportedInputTypes = ['string', 'number', 'email', 'tel', 'date', 'datetime', 'datetime-local', 'month', 'time', 'range'];
  if (element.inputType && !supportedInputTypes.includes(element.inputType)) {
    warnings.push({
      type: 'input_type_lost',
      property: 'inputType',
      value: element.inputType,
      message: `Input type "${element.inputType}" not supported`,
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

function checkLostCommonFeatures(element, warnings, visibleIfConverted = false, enableIfConverted = false) {
  // Only warn about visibleIf if it exists AND was not successfully converted
  if (element.visibleIf && !visibleIfConverted) {
    warnings.push({
      type: 'conditional_logic_lost',
      property: 'visibleIf',
      value: element.visibleIf,
      message: 'Conditional visibility logic not supported (field always visible)',
      impact: 'high'
    });
  }
  
  // Only warn about enableIf if it exists AND was not successfully converted
  if (element.enableIf && !enableIfConverted) {
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

function convertVisibleIfToEnableWhen(expression, fieldNames = new Set()) {
  if (!expression || typeof expression !== 'string') return null;
  
  try {
    let expr = expression.trim();
    
    let logic = 'AND';
    const hasOr = / or /i.test(expr);
    const hasAnd = / and /i.test(expr);
    
    if (hasOr && hasAnd) return null;
    if (hasOr) logic = 'OR';
    
    const parts = expr.split(hasOr ? / or /i : / and /i);
    const conditions = [];
    
    for (const part of parts) {
      const condition = parseCondition(part.trim());
      if (condition) {
        if (fieldNames.size > 0 && !fieldNames.has(condition.targetId)) {
          continue;
        }
        conditions.push(condition);
      }
    }
    
    if (conditions.length === 0) return null;
    
    return {
      logic: conditions.length === 1 ? 'AND' : logic,
      conditions
    };
  } catch {
    return null;
  }
}

function parseCondition(condition) {
  // Strip leading/trailing parentheses and whitespace used for grouping in SurveyJS
  // Example: "({field} = 'value')" becomes "{field} = 'value'"
  const trimmed = condition.trim().replace(/^\(+/, '').replace(/\)+$/, '').trim();
  
  // Match property accessors: {fieldId.property} operator value
  // Examples: {redFlags.length} > 0, {items.count} >= 5
  let match = trimmed.match(/\{(\w+)\.(\w+)\}\s*(>=|<=|>|<|=|!=|<>)\s*([\d.-]+)/);
  if (match) {
    const [, fieldId, property, op, value] = match;
    const operator = op === '>=' ? 'greaterThanOrEqual'
                   : op === '<=' ? 'lessThanOrEqual'
                   : op === '>' ? 'greaterThan'
                   : op === '<' ? 'lessThan'
                   : op === '=' ? 'equals'
                   : 'notEquals';
    return { 
      targetId: fieldId, 
      operator, 
      value, 
      propertyAccessor: property
    };
  }
  
  // Numeric comparisons without property accessor: {fieldId} > 5, {fieldId} >= 7
  match = trimmed.match(/\{(\w+)\}\s*(>=|<=|>|<)\s*([\d.-]+)/);
  if (match) {
    const [, fieldId, op, value] = match;
    const operator = op === '>=' ? 'greaterThanOrEqual'
                   : op === '<=' ? 'lessThanOrEqual'
                   : op === '>' ? 'greaterThan'
                   : 'lessThan';
    return { targetId: fieldId, operator, value };
  }
  
  // Not equals: {fieldId} != value or {fieldId} <> value
  match = trimmed.match(/\{(\w+)\}\s*(?:!=|<>)\s*'([^']+)'/) ||
          trimmed.match(/\{(\w+)\}\s*(?:!=|<>)\s*"([^"]+)"/) ||
          trimmed.match(/\{(\w+)\}\s*(?:!=|<>)\s*([\w.-]+)/);
  if (match) {
    return { targetId: match[1], operator: 'notEquals', value: match[2] };
  }
  
  // Equals: {fieldId} = value
  match = trimmed.match(/\{(\w+)\}\s*=\s*'([^']+)'/) || 
          trimmed.match(/\{(\w+)\}\s*=\s*"([^"]+)"/) ||
          trimmed.match(/\{(\w+)\}\s*=\s*([\w.-]+)/);
  
  if (match) {
    const value = match[2];
    const normalizedValue = value === 'true' ? 'yes' : value === 'false' ? 'no' : value;
    return { targetId: match[1], operator: 'equals', value: normalizedValue };
  }
  
  // Contains (for text search): {fieldId} contains 'text'
  match = trimmed.match(/\{(\w+)\}\s+contains\s+'([^']+)'/) ||
          trimmed.match(/\{(\w+)\}\s+contains\s+"([^"]+)"/) ||
          trimmed.match(/\{(\w+)\}\s+contains\s+([\w.-]+)/);
  
  if (match) {
    return { targetId: match[1], operator: 'contains', value: match[2] };
  }
  
  // Empty check: {fieldId} empty
  match = trimmed.match(/\{(\w+)\}\s+empty/i);
  if (match) return { targetId: match[1], operator: 'empty', value: '' };
  
  // Not empty check: {fieldId} notempty
  match = trimmed.match(/\{(\w+)\}\s+notempty/i);
  if (match) return { targetId: match[1], operator: 'notEmpty', value: '' };
  
  return null;
}

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

function resolveEnableWhenValues(fields) {
  const fieldMap = buildFieldMap(fields);
  
  const processField = (field) => {
    if (field.enableWhen && field.enableWhen.conditions) {
      field.enableWhen.conditions.forEach(condition => {
        const numericOperators = ['greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual'];
        const skipResolve = numericOperators.includes(condition.operator) || 
                           condition.propertyAccessor ||
                           condition.operator === 'empty' ||
                           condition.operator === 'notEmpty';
        
        if (skipResolve) return;
        
        const targetField = fieldMap.get(condition.targetId);
        
        if (targetField?.options && Array.isArray(targetField.options)) {
          const matchingOption = targetField.options.find(opt => opt.value === condition.value);
          if (matchingOption) {
            condition.value = matchingOption.id;
          }
        }
      });
    }
    
    // Recursively process nested fields (sections)
    if (field.fields && Array.isArray(field.fields)) {
      field.fields.forEach(processField);
    }
  };
  
  fields.forEach(processField);
}

