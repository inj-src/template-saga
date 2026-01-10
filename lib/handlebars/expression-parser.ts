/**
 * Handlebars Expression Parser
 *
 * Parses HTML strings to extract handlebars expressions and build a tree structure
 * for display in the Assign sidebar.
 *
 * Handles:
 * - Standard expressions: {{name}}
 * - Escaped expressions: \{{name}} (rendered as literal)
 * - Raw expressions: {{{name}}} (unescaped HTML)
 * - Raw block: {{{{raw}}}}...{{{{/raw}}}}
 * - Block helpers: {{#each list}}...{{/each}}
 * - Inline helpers: {{capitalizeFirst name}}
 */

import { getHelperConfig, isBlockHelper } from "./helpers-config";

export interface ParsedExpression {
  /** The raw expression string, e.g., "{{#each list}}" or "{{name}}" */
  raw: string;
  /** Type of expression */
  type: "block-open" | "block-close" | "inline" | "variable" | "escaped" | "raw";
  /** Helper name if applicable, e.g., "each", "capitalizeFirst" */
  helperName?: string;
  /** Main argument/variable, e.g., "list", "name" */
  argument?: string;
  /** Nested expressions for block helpers */
  children: ParsedExpression[];
  /** Indentation depth (0 = root level) */
  depth: number;
  /** Position in original string for sorting */
  position: number;
}

/**
 * Regular expression to match all handlebars expression variants:
 * - \{{...}} - Escaped (rendered as literal)
 * - {{{{...}}}} - Raw block tags
 * - {{{...}}} - Triple mustache (unescaped HTML)
 * - {{...}} - Standard expressions
 */
const EXPRESSION_REGEX = /\\?\{{2,4}[^}]+}{2,4}/g;

/**
 * Parse the inner content of an expression to determine type and extract parts
 */
function parseExpressionContent(raw: string): Omit<ParsedExpression, "children" | "depth" | "position"> {
  // Escaped expression: \{{...}}
  if (raw.startsWith("\\{{")) {
    return {
      raw,
      type: "escaped",
      argument: raw.slice(3, -2).trim(),
    };
  }

  // Raw block: {{{{...}}}}
  if (raw.startsWith("{{{{")) {
    const inner = raw.slice(4, -4).trim();
    if (inner.startsWith("/")) {
      return {
        raw,
        type: "block-close",
        helperName: inner.slice(1).split(/\s+/)[0],
      };
    }
    return {
      raw,
      type: "block-open",
      helperName: inner.split(/\s+/)[0],
      argument: inner.split(/\s+/).slice(1).join(" ") || undefined,
    };
  }

  // Triple mustache: {{{...}}}
  if (raw.startsWith("{{{") && raw.endsWith("}}}")) {
    const inner = raw.slice(3, -3).trim();
    const parts = inner.split(/\s+/);
    const firstPart = parts[0];

    // Check if it's a helper
    if (getHelperConfig(firstPart)) {
      return {
        raw,
        type: "inline",
        helperName: firstPart,
        argument: parts.slice(1).join(" ") || undefined,
      };
    }

    return {
      raw,
      type: "raw",
      argument: inner,
    };
  }

  // Standard expression: {{...}}
  const inner = raw.slice(2, -2).trim();

  // Block close: {{/each}}
  if (inner.startsWith("/")) {
    return {
      raw,
      type: "block-close",
      helperName: inner.slice(1).split(/\s+/)[0],
    };
  }

  // Block open: {{#each list}}
  if (inner.startsWith("#")) {
    const withoutHash = inner.slice(1);
    const parts = withoutHash.split(/\s+/);
    return {
      raw,
      type: "block-open",
      helperName: parts[0],
      argument: parts.slice(1).join(" ") || undefined,
    };
  }

  // Else block: {{else}}
  if (inner === "else" || inner.startsWith("else ")) {
    return {
      raw,
      type: "inline",
      helperName: "else",
      argument: inner.slice(5).trim() || undefined,
    };
  }

  // Check for inline helper: {{helperName arg1 arg2}}
  const parts = inner.split(/\s+/);
  const firstPart = parts[0];

  // Check if first part is a known helper
  if (getHelperConfig(firstPart) && !isBlockHelper(firstPart)) {
    return {
      raw,
      type: "inline",
      helperName: firstPart,
      argument: parts.slice(1).join(" ") || undefined,
    };
  }

  // Check for subexpressions or complex paths
  if (parts.length > 1 && !inner.includes("=")) {
    // Could be a helper call like {{capitalizeFirst countryName}}
    // Check if first word looks like a helper (not a path)
    if (!firstPart.includes(".") && !firstPart.startsWith("@") && !firstPart.startsWith("../")) {
      // Might be an unknown helper
      return {
        raw,
        type: "inline",
        helperName: firstPart,
        argument: parts.slice(1).join(" ") || undefined,
      };
    }
  }

  // Simple variable: {{name}}
  return {
    raw,
    type: "variable",
    argument: inner,
  };
}

/**
 * Parse HTML string and extract all handlebars expressions as a flat list
 */
function extractExpressions(html: string): Array<Omit<ParsedExpression, "children" | "depth">> {
  const matches: Array<Omit<ParsedExpression, "children" | "depth">> = [];
  let match: RegExpExecArray | null;

  while ((match = EXPRESSION_REGEX.exec(html)) !== null) {
    const parsed = parseExpressionContent(match[0]);
    matches.push({
      ...parsed,
      position: match.index,
    });
  }

  return matches;
}

/**
 * Build a tree structure from flat expression list
 * Block helpers contain their children, creating proper nesting
 */
function buildExpressionTree(
  expressions: Array<Omit<ParsedExpression, "children" | "depth">>
): ParsedExpression[] {
  const root: ParsedExpression[] = [];
  const stack: ParsedExpression[][] = [root];
  let currentDepth = 0;

  for (const expr of expressions) {
    const current = stack[stack.length - 1];

    if (expr.type === "block-open") {
      const node: ParsedExpression = {
        ...expr,
        children: [],
        depth: currentDepth,
      };
      current.push(node);
      stack.push(node.children);
      currentDepth++;
    } else if (expr.type === "block-close") {
      // Pop the stack, but keep closing tag as visual indicator
      if (stack.length > 1) {
        stack.pop();
        currentDepth--;
      }
      // Add closing tag at current level
      const closingNode: ParsedExpression = {
        ...expr,
        children: [],
        depth: currentDepth,
      };
      stack[stack.length - 1].push(closingNode);
    } else {
      const node: ParsedExpression = {
        ...expr,
        children: [],
        depth: currentDepth,
      };
      current.push(node);
    }
  }

  return root;
}

/**
 * Flatten tree back to list with correct depth values for rendering
 */
export function flattenExpressionTree(tree: ParsedExpression[]): ParsedExpression[] {
  const result: ParsedExpression[] = [];

  function traverse(nodes: ParsedExpression[]) {
    for (const node of nodes) {
      result.push(node);
      if (node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(tree);
  return result;
}

/**
 * Main entry point: Parse HTML and return expression tree
 */
export function parseHandlebarsExpressions(html: string): ParsedExpression[] {
  const expressions = extractExpressions(html);
  return buildExpressionTree(expressions);
}

/**
 * Get flat list of expressions with proper depth for rendering
 */
export function parseHandlebarsExpressionsFlat(html: string): ParsedExpression[] {
  const tree = parseHandlebarsExpressions(html);
  return flattenExpressionTree(tree);
}
