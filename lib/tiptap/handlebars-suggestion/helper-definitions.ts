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
 * just-handlebars-helpers - Conditional helpers
 */
export const JHH_CONDITIONAL_HELPERS: HelperDefinition[] = [
  {
    name: 'eq',
    type: 'inline',
    description: 'Strict equality (===)',
    params: [
      { name: 'value1', type: 'any', required: true, desc: 'First value' },
      { name: 'value2', type: 'any', required: true, desc: 'Second value' },
    ],
  },
  {
    name: 'eqw',
    type: 'inline',
    description: 'Weak equality (==)',
    params: [
      { name: 'value1', type: 'any', required: true, desc: 'First value' },
      { name: 'value2', type: 'any', required: true, desc: 'Second value' },
    ],
  },
  {
    name: 'neq',
    type: 'inline',
    description: 'Strict inequality (!==)',
    params: [
      { name: 'value1', type: 'any', required: true, desc: 'First value' },
      { name: 'value2', type: 'any', required: true, desc: 'Second value' },
    ],
  },
  {
    name: 'neqw',
    type: 'inline',
    description: 'Weak inequality (!=)',
    params: [
      { name: 'value1', type: 'any', required: true, desc: 'First value' },
      { name: 'value2', type: 'any', required: true, desc: 'Second value' },
    ],
  },
  {
    name: 'lt',
    type: 'inline',
    description: 'Less than (<)',
    params: [
      { name: 'value1', type: 'any', required: true, desc: 'First value' },
      { name: 'value2', type: 'any', required: true, desc: 'Second value' },
    ],
  },
  {
    name: 'lte',
    type: 'inline',
    description: 'Less than or equal (<=)',
    params: [
      { name: 'value1', type: 'any', required: true, desc: 'First value' },
      { name: 'value2', type: 'any', required: true, desc: 'Second value' },
    ],
  },
  {
    name: 'gt',
    type: 'inline',
    description: 'Greater than (>)',
    params: [
      { name: 'value1', type: 'any', required: true, desc: 'First value' },
      { name: 'value2', type: 'any', required: true, desc: 'Second value' },
    ],
  },
  {
    name: 'gte',
    type: 'inline',
    description: 'Greater than or equal (>=)',
    params: [
      { name: 'value1', type: 'any', required: true, desc: 'First value' },
      { name: 'value2', type: 'any', required: true, desc: 'Second value' },
    ],
  },
  {
    name: 'not',
    type: 'inline',
    description: 'Logical NOT (!)',
    params: [{ name: 'expression', type: 'any', required: true, desc: 'Expression to negate' }],
  },
  {
    name: 'ifx',
    type: 'inline',
    description: 'Ternary conditional (?:)',
    params: [
      { name: 'condition', type: 'boolean', required: true, desc: 'Condition to evaluate' },
      { name: 'trueValue', type: 'any', required: true, desc: 'Value if true' },
      { name: 'falseValue', type: 'any', required: false, desc: 'Value if false (default: empty string)' },
    ],
  },
  {
    name: 'empty',
    type: 'inline',
    description: 'Check if array is empty',
    params: [{ name: 'array', type: 'array', required: true, desc: 'Array to check' }],
  },
  {
    name: 'count',
    type: 'inline',
    description: 'Get array length',
    params: [{ name: 'array', type: 'array', required: true, desc: 'Array to count' }],
  },
  {
    name: 'and',
    type: 'inline',
    description: 'Logical AND of all parameters',
    params: [
      { name: 'value1', type: 'any', required: true, desc: 'First value' },
      { name: 'value2', type: 'any', required: true, desc: 'Second value' },
    ],
  },
  {
    name: 'or',
    type: 'inline',
    description: 'Logical OR of all parameters',
    params: [
      { name: 'value1', type: 'any', required: true, desc: 'First value' },
      { name: 'value2', type: 'any', required: true, desc: 'Second value' },
    ],
  },
  {
    name: 'coalesce',
    type: 'inline',
    description: 'Returns first non-falsy value',
    params: [
      { name: 'value1', type: 'any', required: true, desc: 'First value' },
      { name: 'value2', type: 'any', required: true, desc: 'Second value' },
    ],
  },
  {
    name: 'includes',
    type: 'inline',
    description: 'Check if array includes value',
    params: [
      { name: 'array', type: 'array', required: true, desc: 'Array to search' },
      { name: 'value', type: 'any', required: true, desc: 'Value to find' },
      { name: 'strict', type: 'boolean', required: false, desc: 'Use strict comparison (default: true)' },
    ],
  },
];

/**
 * just-handlebars-helpers - String helpers
 */
export const JHH_STRING_HELPERS: HelperDefinition[] = [
  {
    name: 'excerpt',
    type: 'inline',
    description: 'Extract substring with ellipsis',
    params: [
      { name: 'string', type: 'string', required: true, desc: 'Source string' },
      { name: 'length', type: 'number', required: false, desc: 'Max length (default: 50)' },
    ],
  },
  {
    name: 'sanitize',
    type: 'inline',
    description: 'Convert string to URL-friendly dash-case',
    params: [{ name: 'string', type: 'string', required: true, desc: 'String to sanitize' }],
  },
  {
    name: 'newLineToBr',
    type: 'inline',
    description: 'Replace \\n with <br> tags',
    params: [{ name: 'string', type: 'string', required: true, desc: 'String with newlines' }],
  },
  {
    name: 'capitalizeEach',
    type: 'inline',
    description: 'Capitalize first letter of each word',
    params: [{ name: 'string', type: 'string', required: true, desc: 'String to capitalize' }],
  },
  {
    name: 'capitalizeFirst',
    type: 'inline',
    description: 'Capitalize first letter of string',
    params: [{ name: 'string', type: 'string', required: true, desc: 'String to capitalize' }],
  },
  {
    name: 'lowercase',
    type: 'inline',
    description: 'Convert string to lowercase',
    params: [{ name: 'string', type: 'string', required: true, desc: 'String to convert' }],
  },
  {
    name: 'uppercase',
    type: 'inline',
    description: 'Convert string to uppercase',
    params: [{ name: 'string', type: 'string', required: true, desc: 'String to convert' }],
  },
  {
    name: 'first',
    type: 'inline',
    description: 'Get first element of array',
    params: [{ name: 'array', type: 'array', required: true, desc: 'Source array' }],
  },
  {
    name: 'last',
    type: 'inline',
    description: 'Get last element of array',
    params: [{ name: 'array', type: 'array', required: true, desc: 'Source array' }],
  },
  {
    name: 'concat',
    type: 'inline',
    description: 'Concatenate strings',
    params: [
      { name: 'string1', type: 'string', required: true, desc: 'First string' },
      { name: 'string2', type: 'string', required: true, desc: 'Second string' },
    ],
  },
  {
    name: 'join',
    type: 'inline',
    description: 'Join array elements with delimiter',
    params: [
      { name: 'array', type: 'array', required: true, desc: 'Array to join' },
      { name: 'delimiter', type: 'string', required: true, desc: 'Delimiter string' },
    ],
  },
];

/**
 * just-handlebars-helpers - Math helpers
 */
export const JHH_MATH_HELPERS: HelperDefinition[] = [
  {
    name: 'sum',
    type: 'inline',
    description: 'Add two numbers',
    params: [
      { name: 'value1', type: 'number', required: true, desc: 'First number' },
      { name: 'value2', type: 'number', required: true, desc: 'Second number' },
    ],
  },
  {
    name: 'difference',
    type: 'inline',
    description: 'Subtract two numbers',
    params: [
      { name: 'value1', type: 'number', required: true, desc: 'First number' },
      { name: 'value2', type: 'number', required: true, desc: 'Second number' },
    ],
  },
  {
    name: 'multiplication',
    type: 'inline',
    description: 'Multiply two numbers',
    params: [
      { name: 'value1', type: 'number', required: true, desc: 'First number' },
      { name: 'value2', type: 'number', required: true, desc: 'Second number' },
    ],
  },
  {
    name: 'division',
    type: 'inline',
    description: 'Divide two numbers',
    params: [
      { name: 'value1', type: 'number', required: true, desc: 'Dividend' },
      { name: 'value2', type: 'number', required: true, desc: 'Divisor' },
    ],
  },
  {
    name: 'remainder',
    type: 'inline',
    description: 'Get remainder of division (modulo)',
    params: [
      { name: 'value1', type: 'number', required: true, desc: 'Dividend' },
      { name: 'value2', type: 'number', required: true, desc: 'Divisor' },
    ],
  },
  {
    name: 'ceil',
    type: 'inline',
    description: 'Round up to nearest integer',
    params: [{ name: 'value', type: 'number', required: true, desc: 'Number to round' }],
  },
  {
    name: 'floor',
    type: 'inline',
    description: 'Round down to nearest integer',
    params: [{ name: 'value', type: 'number', required: true, desc: 'Number to round' }],
  },
  {
    name: 'abs',
    type: 'inline',
    description: 'Get absolute value',
    params: [{ name: 'value', type: 'number', required: true, desc: 'Number' }],
  },
];

/**
 * just-handlebars-helpers - DateTime & Formatter helpers
 */
export const JHH_FORMATTER_HELPERS: HelperDefinition[] = [
  {
    name: 'formatDate',
    type: 'inline',
    description: 'Format date using moment.js',
    params: [
      { name: 'format', type: 'string', required: true, desc: 'Format string (e.g. MM/DD/YYYY)' },
      { name: 'date', type: 'date', required: false, desc: 'Date to format (default: now)' },
      { name: 'locale', type: 'string', required: false, desc: 'Locale code (e.g. en, es)' },
    ],
  },
  {
    name: 'formatCurrency',
    type: 'inline',
    description: 'Format currency value',
    params: [{ name: 'value', type: 'number', required: true, desc: 'Currency amount' }],
    hashParams: [
      { name: 'code', type: 'string', desc: 'Currency code (e.g. USD, EUR)' },
      { name: 'locale', type: 'string', desc: 'Locale for formatting' },
    ],
  },
];

/**
 * All helpers combined
 */
export const ALL_HELPERS: HelperDefinition[] = [
  ...BUILTIN_HELPERS,
  ...CUSTOM_HELPERS,
  ...JHH_CONDITIONAL_HELPERS,
  ...JHH_STRING_HELPERS,
  ...JHH_MATH_HELPERS,
  ...JHH_FORMATTER_HELPERS,
];

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
