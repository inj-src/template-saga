/**
 * Lint Handlebars templates for unclosed/orphaned block helpers.
 */

import { getBlockHelpers } from './helper-definitions';

export interface LintError {
  type: 'unclosed' | 'orphaned';
  helperName: string;
  position: number;
  message: string;
}

interface ParsedTag {
  helperName: string;
  pos: number;
  endPos: number;
}

/**
 * Parse all opening block tags {{#helperName ...}}
 */
function parseOpeningTags(text: string): ParsedTag[] {
  const results: ParsedTag[] = [];
  const regex = /\{\{#(\w+)\s+[^}]*?\}\}/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    results.push({
      helperName: match[1],
      pos: match.index,
      endPos: match.index + match[0].length,
    });
  }

  return results;
}

/**
 * Parse all closing block tags {{/helperName}}
 */
function parseClosingTags(text: string): ParsedTag[] {
  const results: ParsedTag[] = [];
  const regex = /\{\{\/(\w+)\}\}/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    results.push({
      helperName: match[1],
      pos: match.index,
      endPos: match.index + match[0].length,
    });
  }

  return results;
}

/**
 * Lint the template text for unclosed or orphaned block helpers.
 * Uses a stack-based approach to match opening/closing tags.
 */
export function lintHandlebarsBlocks(text: string): LintError[] {
  const errors: LintError[] = [];
  const blockHelperNames = new Set(getBlockHelpers().map((h) => h.name));

  const openingTags = parseOpeningTags(text);
  const closingTags = parseClosingTags(text);

  // Merge and sort all tags by position
  type TagWithType = ParsedTag & { tagType: 'open' | 'close' };
  const allTags: TagWithType[] = [
    ...openingTags.map((t) => ({ ...t, tagType: 'open' as const })),
    ...closingTags.map((t) => ({ ...t, tagType: 'close' as const })),
  ].sort((a, b) => a.pos - b.pos);

  // Stack to track open blocks: { helperName, pos }
  const stack: { helperName: string; pos: number }[] = [];

  for (const tag of allTags) {
    // Only lint known block helpers
    if (!blockHelperNames.has(tag.helperName)) continue;

    if (tag.tagType === 'open') {
      stack.push({ helperName: tag.helperName, pos: tag.pos });
    } else {
      // Closing tag
      const lastOpen = stack[stack.length - 1];

      if (!lastOpen || lastOpen.helperName !== tag.helperName) {
        // Orphaned closing tag
        errors.push({
          type: 'orphaned',
          helperName: tag.helperName,
          position: tag.pos,
          message: `Orphaned closing tag {{/${tag.helperName}}} without matching opening`,
        });
      } else {
        // Matched - pop from stack
        stack.pop();
      }
    }
  }

  // Remaining in stack are unclosed
  for (const open of stack) {
    errors.push({
      type: 'unclosed',
      helperName: open.helperName,
      position: open.pos,
      message: `Unclosed block helper {{#${open.helperName}}} - missing {{/${open.helperName}}}`,
    });
  }

  return errors;
}
