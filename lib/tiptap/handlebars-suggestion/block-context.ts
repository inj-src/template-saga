/**
 * Block context detection for Handlebars templates.
 * Parses the document to find block helpers enclosing the cursor position
 * and resolves the current data context for context-aware suggestions.
 */

import { getHelperByName, type HelperDefinition, type PrivateVar } from './helper-definitions';

/**
 * Represents a block helper that encloses the cursor position.
 */
export interface BlockHelperContext {
  /** Helper name (e.g., "each", "with") */
  helperName: string;
  /** The param passed to the helper (e.g., "items", "user.orders") */
  param: string;
  /** Position of the opening tag start */
  startPos: number;
  /** Position of the closing tag end */
  endPos: number;
  /** The helper definition, if found */
  helper: HelperDefinition | undefined;
}

/**
 * The resolved context stack at a cursor position.
 */
export interface ContextStack {
  /** Block helpers from outermost to innermost */
  blocks: BlockHelperContext[];
  /** The resolved data path after following all context switches */
  currentPath: string;
  /** All private variables available from enclosing blocks */
  availablePrivateVars: PrivateVar[];
  /** 
   * Context paths at each nesting level for ../ navigation.
   * Index 0 = root context (''), each subsequent index is the path after that block's context switch.
   * Length = blocks.length + 1 (includes root)
   */
  parentContextPaths: string[];
}

/**
 * Parse all block helper opening tags in the text.
 * Returns array of { helperName, param, position }
 */
function parseOpeningTags(text: string): Array<{ helperName: string; param: string; pos: number }> {
  const results: Array<{ helperName: string; param: string; pos: number }> = [];
  // Match {{#helperName param}} or {{#helperName param key=value}}
  const regex = /\{\{#(\w+)\s+([^}]+?)\s*\}\}/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const helperName = match[1];
    // Extract the first param (before any hash params)
    const paramsStr = match[2].trim();
    const param = paramsStr.split(/\s+/)[0]; // First token is the context param

    results.push({
      helperName,
      param,
      pos: match.index,
    });
  }

  return results;
}

/**
 * Find the position of the matching closing tag for a block helper.
 * Handles nested blocks of the same helper type.
 */
function findClosingTag(text: string, helperName: string, startSearchPos: number): number {
  const openPattern = new RegExp(`\\{\\{#${helperName}\\s`, 'g');
  const closePattern = new RegExp(`\\{\\{/${helperName}\\}\\}`, 'g');

  let depth = 1;
  let pos = startSearchPos;

  while (pos < text.length && depth > 0) {
    openPattern.lastIndex = pos;
    closePattern.lastIndex = pos;

    const nextOpen = openPattern.exec(text);
    const nextClose = closePattern.exec(text);

    if (!nextClose) {
      // No closing tag found
      return -1;
    }

    if (nextOpen && nextOpen.index < nextClose.index) {
      // Found another opening tag first - increase depth
      depth++;
      pos = nextOpen.index + 1;
    } else {
      // Found closing tag
      depth--;
      if (depth === 0) {
        // Return position after the closing tag
        return nextClose.index + nextClose[0].length;
      }
      pos = nextClose.index + 1;
    }
  }

  return -1;
}

/**
 * Navigate to a path in the data object and return the value.
 * Returns undefined if path is invalid or data is not traversable.
 */
function getValueAtPath(data: unknown, path: string): unknown {
  if (!path || data === null || data === undefined) {
    return data;
  }

  const segments = path.split('.');
  let current: unknown = data;

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (typeof current !== 'object') {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

/**
 * Resolve the new context path after a block helper context switch.
 */
function resolveContextPath(
  currentPath: string,
  param: string,
  helper: HelperDefinition | undefined,
  data: unknown
): string {
  if (!helper?.switchesContext) {
    // Helper doesn't switch context, keep current path
    return currentPath;
  }

  // Build the full path to the param
  const fullParamPath = currentPath ? `${currentPath}.${param}` : param;

  if (helper.contextResolution === 'element') {
    // For array iteration, context becomes array element
    // We append [0] conceptually but for path resolution we just use the array path
    // The getSuggestionsAtPath will handle getting the element type
    const value = getValueAtPath(data, fullParamPath);

    if (Array.isArray(value) && value.length > 0) {
      // Return path that points to first element structure
      // We mark this specially so field resolution knows to look at array elements
      return `${fullParamPath}.[0]`;
    }

    // If not an array or empty, just use the path
    return fullParamPath;
  }

  // Direct context resolution
  return fullParamPath;
}

/**
 * Get all block helpers that enclose the given cursor position.
 * 
 * @param fullText - The complete document text
 * @param cursorPos - Character position of the cursor
 * @param data - The data object for context resolution (can be undefined)
 * @returns The context stack with resolved path and available private variables
 */
export function getBlockContextAtPosition(
  fullText: string,
  cursorPos: number,
  data: unknown
): ContextStack {
  const result: ContextStack = {
    blocks: [],
    currentPath: '',
    availablePrivateVars: [
      { name: '@root', desc: 'Access root context' },
    ],
    parentContextPaths: [''],  // Start with root context
  };

  // Parse all opening tags
  const openingTags = parseOpeningTags(fullText);

  // Find blocks that enclose the cursor
  const enclosingBlocks: BlockHelperContext[] = [];

  for (const tag of openingTags) {
    if (tag.pos >= cursorPos) {
      // This tag starts after cursor, skip
      continue;
    }

    // Find the matching closing tag
    const endOfOpenTag = fullText.indexOf('}}', tag.pos) + 2;
    const closingPos = findClosingTag(fullText, tag.helperName, endOfOpenTag);

    if (closingPos === -1 || closingPos <= cursorPos) {
      // No closing tag or cursor is after the block
      continue;
    }

    if (endOfOpenTag > cursorPos) {
      // Cursor is inside the opening tag, skip
      continue;
    }

    // This block encloses the cursor
    const helper = getHelperByName(tag.helperName);
    enclosingBlocks.push({
      helperName: tag.helperName,
      param: tag.param,
      startPos: tag.pos,
      endPos: closingPos,
      helper,
    });
  }

  // Sort by start position (outermost to innermost)
  enclosingBlocks.sort((a, b) => a.startPos - b.startPos);

  result.blocks = enclosingBlocks;

  // Resolve the context path by following all context switches
  // Build parentContextPaths: [root, afterBlock1, afterBlock2, ...]
  const parentContextPaths: string[] = [''];  // Start with root context
  let contextPath = '';

  for (const block of enclosingBlocks) {
    contextPath = resolveContextPath(contextPath, block.param, block.helper, data);
    parentContextPaths.push(contextPath);

    // Collect private variables from this block
    if (block.helper?.privateVars) {
      result.availablePrivateVars.push(...block.helper.privateVars);
    }
  }

  result.currentPath = contextPath;
  result.parentContextPaths = parentContextPaths;

  return result;
}

/**
 * Get the effective data value at the current context.
 * Handles array element access for iteration contexts.
 */
export function getDataAtContext(data: unknown, contextPath: string): unknown {
  if (!contextPath || data === null || data === undefined) {
    return data;
  }

  // Handle [0] suffix for array element access
  if (contextPath.endsWith('.[0]')) {
    const arrayPath = contextPath.slice(0, -4); // Remove .[0]
    const arrayValue = getValueAtPath(data, arrayPath);

    if (Array.isArray(arrayValue) && arrayValue.length > 0) {
      return arrayValue[0]; // Return first element as type representative
    }

    return undefined;
  }

  return getValueAtPath(data, contextPath);
}

/**
 * Get the context path for a given number of parent levels up.
 * 
 * @param contextStack - The current context stack
 * @param parentLevels - Number of ../ levels to go up (0 = current, 1 = parent, etc.)
 * @returns The resolved context path, or current path if parentLevels exceeds available parents
 */
export function getParentContextPath(
  contextStack: ContextStack,
  parentLevels: number
): string {
  if (parentLevels <= 0) {
    return contextStack.currentPath;
  }

  // parentContextPaths: [root, afterBlock1, afterBlock2, ..., current]
  // To go up N levels from current, we want index = length - 1 - N
  const targetIndex = contextStack.parentContextPaths.length - 1 - parentLevels;

  // Clamp to valid range (at minimum, return root context)
  const clampedIndex = Math.max(0, targetIndex);

  return contextStack.parentContextPaths[clampedIndex] ?? '';
}
