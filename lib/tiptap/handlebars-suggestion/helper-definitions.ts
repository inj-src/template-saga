/**
 * Helper definitions for Handlebars autocomplete suggestions.
 * Includes both built-in Handlebars helpers and custom helpers.
 */

export type HelperType = 'inline' | 'block';

export interface HelperParam {
  name: string;
  type: string;
  required?: boolean;
  desc?: string;
}

export interface HashParam {
  name: string;
  type: string;
  desc: string;
}

export interface PrivateVar {
  name: string;
  desc: string;
}

export interface HelperDefinition {
  name: string;
  type: HelperType;
  description: string;
  params?: HelperParam[];
  hashParams?: HashParam[];
  /** Private variables injected inside the block scope */
  privateVars?: PrivateVar[];
  /** Does this helper switch the context for its block? */
  switchesContext?: boolean;
  /** What data type does this helper expect its first param to be? */
  expectedDataType?: 'array' | 'object' | 'any';
  /** 
   * How to resolve the new context from the param:
   * - 'element': context becomes each element (for array iteration)
   * - 'direct': context becomes the param value directly
   */
  contextResolution?: 'element' | 'direct';
}

/**
 * Built-in Handlebars helpers
 */
export const BUILTIN_HELPERS: HelperDefinition[] = [
  // Block helpers
  {
    name: 'each',
    type: 'block',
    description: 'Iterate over an array or object',
    params: [{ name: 'context', type: 'array|object', required: true }],
    privateVars: [
      { name: '@index', desc: 'Current array index (0-based)' },
      { name: '@first', desc: 'True if first iteration' },
      { name: '@last', desc: 'True if last iteration' },
      { name: '@key', desc: 'Current key (for object iteration)' },
    ],
    switchesContext: true,
    expectedDataType: 'array',
    contextResolution: 'element',
  },
  {
    name: 'if',
    type: 'block',
    description: 'Conditionally render content if value is truthy',
    params: [{ name: 'condition', type: 'any', required: true }],
  },
  {
    name: 'unless',
    type: 'block',
    description: 'Conditionally render content if value is falsy',
    params: [{ name: 'condition', type: 'any', required: true }],
  },
  {
    name: 'with',
    type: 'block',
    description: 'Change context for the block',
    params: [{ name: 'context', type: 'object', required: true }],
    switchesContext: true,
    expectedDataType: 'object',
    contextResolution: 'direct',
  },
  // Inline helpers
  {
    name: 'lookup',
    type: 'inline',
    description: 'Dynamic property lookup',
    params: [
      { name: 'object', type: 'object', required: true },
      { name: 'property', type: 'string', required: true },
    ],
  },
  {
    name: 'log',
    type: 'inline',
    description: 'Log values to console',
    params: [{ name: 'value', type: 'any', required: true }],
  },
];

/**
 * Custom helpers defined in this project
 */
export const CUSTOM_HELPERS: HelperDefinition[] = [
  {
    name: 'table',
    type: 'block',
    description: 'Iterate over array and populate table rows',
    params: [{ name: 'context', type: 'array', required: true, desc: 'Array of data to iterate' }],
    hashParams: [
      { name: 'target', type: 'string', desc: 'Target table name (from table-target)' },
      { name: 'sum', type: 'string', desc: 'Comma-separated fields to sum. Access via @sum-field' },
      { name: 'multiply', type: 'string', desc: 'Comma-separated fields to multiply. Access via @multiply-field' },
      { name: 'min', type: 'string', desc: 'Comma-separated fields to find min. Access via @min-field-N' },
      { name: 'max', type: 'string', desc: 'Comma-separated fields to find max. Access via @max-field-N' },
      { name: 'length', type: 'string', desc: 'Comma-separated fields to count. Access via @length-field' },
    ],
    privateVars: [
      { name: '@index', desc: 'Current row index' },
      { name: '@first', desc: 'True if first row' },
      { name: '@last', desc: 'True if last row' },
      { name: '@length', desc: 'Total number of items' },
    ],
    switchesContext: true,
    expectedDataType: 'array',
    contextResolution: 'element',
  },
  {
    name: 'table-target',
    type: 'block',
    description: 'Mark a table as target for table helper',
    params: [{ name: 'name', type: 'string', desc: 'Target name for the table' }],
  },
  {
    name: 'accumulate',
    type: 'inline',
    description: 'Accumulate/sum values across iterations',
    params: [{ name: 'value', type: 'number|string', required: true }],
    hashParams: [
      { name: 'initial', type: 'number', desc: 'Initial value (default: 0)' },
      { name: 'key', type: 'string', desc: 'Key to track accumulation' },
    ],
  },
];

/**
 * All helpers combined
 */
export const ALL_HELPERS: HelperDefinition[] = [...BUILTIN_HELPERS, ...CUSTOM_HELPERS];

/**
 * Get block helpers only
 */
export function getBlockHelpers(): HelperDefinition[] {
  return ALL_HELPERS.filter((h) => h.type === 'block');
}

/**
 * Get inline helpers only
 */
export function getInlineHelpers(): HelperDefinition[] {
  return ALL_HELPERS.filter((h) => h.type === 'inline');
}

/**
 * Find a helper by name
 */
export function getHelperByName(name: string): HelperDefinition | undefined {
  return ALL_HELPERS.find((h) => h.name === name);
}

/**
 * Get private variables for a specific helper
 */
export function getPrivateVarsForHelper(helperName: string): PrivateVar[] {
  const helper = getHelperByName(helperName);
  return helper?.privateVars || [];
}

/**
 * Common private variables available in most block contexts
 */
export const COMMON_PRIVATE_VARS: PrivateVar[] = [
  { name: '@root', desc: 'Access root context' },
  { name: '@first', desc: 'True if first iteration' },
  { name: '@last', desc: 'True if last iteration' },
  { name: '@index', desc: 'Current iteration index' },
  { name: '@key', desc: 'Current key (for objects)' },
];
