/**
 * Handlebars Helper Configuration
 *
 * Centralized metadata for all registered helpers.
 * Used by the expression parser to determine behavior (block vs inline, context switching).
 */

export interface HelperConfig {
  name: string;
  type: "block" | "inline";
  category: string;
  description: string;
  /** If true, this block helper changes the evaluation context (e.g., #each, #with) */
  switchesContext?: boolean;
}

export type HelperCategory =
  | "built-in"
  | "custom"
  | "conditional"
  | "string"
  | "math"
  | "datetime"
  | "html"
  | "formatter";

/**
 * Built-in Handlebars helpers
 */
const builtInHelpers: HelperConfig[] = [
  {
    name: "each",
    type: "block",
    category: "built-in",
    description: "Iterates over arrays or objects",
    switchesContext: true,
  },
  {
    name: "with",
    type: "block",
    category: "built-in",
    description: "Changes context to the specified object",
    switchesContext: true,
  },
  {
    name: "if",
    type: "block",
    category: "built-in",
    description: "Conditional rendering based on truthiness",
    switchesContext: false,
  },
  {
    name: "unless",
    type: "block",
    category: "built-in",
    description: "Inverse of #if - renders if falsy",
    switchesContext: false,
  },
  {
    name: "lookup",
    type: "inline",
    category: "built-in",
    description: "Dynamic property lookup",
  },
  {
    name: "log",
    type: "inline",
    category: "built-in",
    description: "Logs values during template execution",
  },
];

/**
 * Custom project helpers (from helpers.ts)
 */
const customHelpers: HelperConfig[] = [
  {
    name: "table",
    type: "block",
    category: "custom",
    description: "Table iteration helper with aggregation functions",
    switchesContext: true,
  },
  {
    name: "table-target",
    type: "block",
    category: "custom",
    description: "Marks a table as target for table helper",
    switchesContext: false,
  },
  {
    name: "accumulate",
    type: "inline",
    category: "custom",
    description: "Running total accumulator",
  },
];

/**
 * just-handlebars-helpers - Conditional
 */
const conditionalHelpers: HelperConfig[] = [
  { name: "eq", type: "inline", category: "conditional", description: "Strict equality (===)" },
  { name: "eqw", type: "inline", category: "conditional", description: "Weak equality (==)" },
  { name: "neq", type: "inline", category: "conditional", description: "Strict inequality (!==)" },
  { name: "neqw", type: "inline", category: "conditional", description: "Weak inequality (!=)" },
  { name: "lt", type: "inline", category: "conditional", description: "Less than (<)" },
  { name: "lte", type: "inline", category: "conditional", description: "Less than or equal (<=)" },
  { name: "gt", type: "inline", category: "conditional", description: "Greater than (>)" },
  { name: "gte", type: "inline", category: "conditional", description: "Greater than or equal (>=)" },
  { name: "not", type: "inline", category: "conditional", description: "Logical NOT (!)" },
  { name: "ifx", type: "inline", category: "conditional", description: "Ternary operator (?:)" },
  { name: "empty", type: "inline", category: "conditional", description: "Check if empty" },
  { name: "count", type: "inline", category: "conditional", description: "Count elements" },
  { name: "and", type: "inline", category: "conditional", description: "Logical AND" },
  { name: "or", type: "inline", category: "conditional", description: "Logical OR" },
  { name: "coalesce", type: "inline", category: "conditional", description: "Return first non-empty value" },
  { name: "includes", type: "inline", category: "conditional", description: "Check if array includes value" },
];

/**
 * just-handlebars-helpers - String
 */
const stringHelpers: HelperConfig[] = [
  { name: "excerpt", type: "inline", category: "string", description: "Extract substring" },
  { name: "sanitize", type: "inline", category: "string", description: "Convert to URL-friendly string" },
  { name: "newLineToBr", type: "inline", category: "string", description: "Replace \\n with <br>" },
  { name: "capitalizeEach", type: "inline", category: "string", description: "Capitalize each word" },
  { name: "capitalizeFirst", type: "inline", category: "string", description: "Capitalize first letter" },
  { name: "sprintf", type: "inline", category: "string", description: "Formatted string output" },
  { name: "lowercase", type: "inline", category: "string", description: "Convert to lowercase" },
  { name: "uppercase", type: "inline", category: "string", description: "Convert to uppercase" },
  { name: "first", type: "inline", category: "string", description: "Get first element" },
  { name: "last", type: "inline", category: "string", description: "Get last element" },
  { name: "concat", type: "inline", category: "string", description: "Concatenate strings" },
  { name: "join", type: "inline", category: "string", description: "Join array elements" },
];

/**
 * just-handlebars-helpers - Math
 */
const mathHelpers: HelperConfig[] = [
  { name: "sum", type: "inline", category: "math", description: "Add two numbers" },
  { name: "difference", type: "inline", category: "math", description: "Subtract two numbers" },
  { name: "multiplication", type: "inline", category: "math", description: "Multiply two numbers" },
  { name: "division", type: "inline", category: "math", description: "Divide two numbers" },
  { name: "remainder", type: "inline", category: "math", description: "Modulo operation" },
  { name: "ceil", type: "inline", category: "math", description: "Round up" },
  { name: "floor", type: "inline", category: "math", description: "Round down" },
  { name: "abs", type: "inline", category: "math", description: "Absolute value" },
];

/**
 * just-handlebars-helpers - DateTime
 */
const dateTimeHelpers: HelperConfig[] = [
  { name: "formatDate", type: "inline", category: "datetime", description: "Format date using moment.js" },
];

/**
 * just-handlebars-helpers - HTML
 */
const htmlHelpers: HelperConfig[] = [
  { name: "showIf", type: "inline", category: "html", description: "Show element if condition" },
  { name: "hideIf", type: "inline", category: "html", description: "Hide element if condition" },
  { name: "selectedIf", type: "inline", category: "html", description: "Add selected attribute" },
  { name: "checkedIf", type: "inline", category: "html", description: "Add checked attribute" },
  { name: "options", type: "inline", category: "html", description: "Generate select options" },
];

/**
 * just-handlebars-helpers - Formatters
 */
const formatterHelpers: HelperConfig[] = [
  { name: "formatCurrency", type: "inline", category: "formatter", description: "Format currency value" },
];

/**
 * All helpers combined
 */
export const allHelpers: HelperConfig[] = [
  ...builtInHelpers,
  ...customHelpers,
  ...conditionalHelpers,
  ...stringHelpers,
  ...mathHelpers,
  ...dateTimeHelpers,
  ...htmlHelpers,
  ...formatterHelpers,
];

/**
 * Helper lookup map for O(1) access
 */
export const helperMap = new Map<string, HelperConfig>(
  allHelpers.map((h) => [h.name, h])
);

/**
 * Get helper config by name
 */
export function getHelperConfig(name: string): HelperConfig | undefined {
  return helperMap.get(name);
}

/**
 * Check if a helper is a block helper
 */
export function isBlockHelper(name: string): boolean {
  return helperMap.get(name)?.type === "block";
}

/**
 * Check if a helper switches context (for indentation)
 */
export function switchesContext(name: string): boolean {
  return helperMap.get(name)?.switchesContext === true;
}

/**
 * Get all helpers by category
 */
export function getHelpersByCategory(category: HelperCategory): HelperConfig[] {
  return allHelpers.filter((h) => h.category === category);
}
