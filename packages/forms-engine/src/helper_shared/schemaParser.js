import yaml from 'js-yaml';
import { detectSchemaType } from './schemaAdapter.js';

/**
 * Parse input that could be YAML string, JSON string, or object
 * @param {string|object|array} input - The input data
 * @returns {object|array} Parsed JavaScript object/array
 */
export function parseInput(input) {
  if (typeof input === 'object' && input !== null) {
    return input;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        try {
          return yaml.load(trimmed);
        } catch (_yamlError) {
          throw new Error('Input must be valid JSON or YAML');
        }
      }
    }
    
    try {
      return yaml.load(trimmed);
    } catch {
      throw new Error('Input must be valid YAML or JSON');
    }
  }

  throw new Error('Input must be a string, object, or array');
}

/**
 * Parse and detect schema type from input
 * @param {string|object|array} input - Raw input data
 * @param {string} [manualSchemaType] - Optional manual override for schema type
 * @returns {{data: object|array, schemaType: 'mieforms'|'surveyjs'|'unknown'}} Parsed data and detected type
 */
export function parseAndDetect(input, manualSchemaType = null) {
  const parsed = parseInput(input);
  const detectedType = manualSchemaType || detectSchemaType(parsed);
  
  return {
    data: parsed,
    schemaType: detectedType
  };
}
