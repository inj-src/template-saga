/**
 * Utility functions for generating field suggestions from JSON data.
 * Used by the Handlebars suggestion menu to provide autocomplete options.
 */

export type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null' | 'undefined';

export interface FieldSuggestion {
  /** Field name/key */
  name: string;
  /** Type of the field value */
  type: FieldType;
  /** The value at this field (for nested navigation) */
  value: unknown;
  /** Full path from root (e.g., "user.address.city") */
  path: string;
}

/**
 * Get the type of a value for display purposes.
 */
export function getFieldType(value: unknown): FieldType {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  return typeof value as FieldType;
}

/**
 * Check if a value is a nested object (not null, not array, is object).
 */
export function isNestedObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Get first-level field suggestions from a data object.
 * 
 * @param data - The JSON data object
 * @param basePath - Optional prefix path (for nested navigation)
 * @returns Array of field suggestions
 */
export function getFieldSuggestions(
  data: unknown,
  basePath: string = ''
): FieldSuggestion[] {
  if (!isNestedObject(data)) {
    return [];
  }

  return Object.entries(data).map(([key, value]) => ({
    name: key,
    type: getFieldType(value),
    value,
    path: basePath ? `${basePath}.${key}` : key,
  }));
}

/**
 * Navigate to a nested path and get suggestions at that level.
 * 
 * @param data - Root JSON data object
 * @param path - Dot-separated path (e.g., "user.address")
 * @returns Array of field suggestions at the path, or empty if path invalid
 */
export function getSuggestionsAtPath(
  data: unknown,
  path: string
): FieldSuggestion[] {
  if (!path) {
    return getFieldSuggestions(data);
  }

  const segments = path.split('.');
  let current: unknown = data;

  for (const segment of segments) {
    if (!isNestedObject(current)) {
      return [];
    }
    current = current[segment];
  }

  return getFieldSuggestions(current, path);
}

/**
 * Format a field path for insertion into handlebars expression.
 * Arrays get .[0] suffix.
 * 
 * @param suggestion - The field suggestion
 * @returns Formatted path string
 */
export function formatFieldPath(suggestion: FieldSuggestion): string {
  if (suggestion.type === 'array') {
    return `${suggestion.path}.[0]`;
  }
  return suggestion.path;
}

/**
 * Parse the current expression text to determine what suggestions to show.
 * 
 * @param expressionText - Text inside the {{ }} (e.g., "user.add" or "")
 * @returns Object with basePath (completed path) and query (partial filter)
 */
export function parseExpressionText(expressionText: string, basePath: string = ''): {
  basePath: string;
  query: string;
  /** Number of ../ prefixes found (parent context navigation) */
  parentLevels: number;
} {
  const trimmed = expressionText.trim();
  
  if (!trimmed) {
    return { basePath: '', query: '', parentLevels: 0 };
  }

  // Count and strip ../ prefixes for parent context navigation
  let parentLevels = 0;
  let remaining = trimmed;

  while (remaining.startsWith('../')) {
    parentLevels++;
    remaining = remaining.slice(3); // Remove '../'
  }

  // Handle edge case where we just have '../' with nothing after
  if (remaining === '' || remaining === '.') {
    return { basePath: '', query: '', parentLevels };
  }

  // Check if ends with dot (user is navigating into object)
  if (remaining.endsWith('.')) {
    return {
      basePath: remaining.slice(0, -1),
      query: '',
      parentLevels,
    };
  }

  // Has a dot - split into basePath and query
  const lastDotIndex = remaining.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return {
      basePath: remaining.slice(0, lastDotIndex),
      query: remaining.slice(lastDotIndex + 1),
      parentLevels,
    };
  }

  // No dot - just a filter query on root level
  return {
    basePath: basePath,
    query: remaining,
    parentLevels,
  };
}
