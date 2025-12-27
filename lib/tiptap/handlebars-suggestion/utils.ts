import { Editor } from "@tiptap/react";
import { ExpressionContext, HelperDefinition, PrivateVar } from "./types";
import { Range } from '@tiptap/react'
import { FieldSuggestion, formatFieldPath, isNestedObject, parseExpressionText } from "./json-field-suggestions";

// Handle helper selection
export function handleHelperSelect(
   editor: Editor,
   range: Range,
   helper: HelperDefinition,
   isBlockContext: boolean
) {

   if (helper.type === 'block') {
      // Block helper: insert opening tag with space for params
      const insertText = isBlockContext
         ? `{{#${helper.name} `
         : `{{#${helper.name} `;

      editor
         .chain()
         .focus()
         // .deleteRange(range)
         .insertContent(insertText)
         .run();
   } else {
      // Inline helper: insert with space for params
      const insertText = `{{${helper.name} `;

      editor
         .chain()
         .focus()
         .insertContent(insertText)
         .run();
   }
}

export function parseQueryContext(query: string, basePath: string = ''): ExpressionContext {
   const trimmed = query.trimStart();

   // Check for block helper context (starts with #)
   if (trimmed.startsWith('#')) {
      const afterHash = trimmed.slice(1);

      // Check if there's a space - means we're in param context
      const spaceIndex = afterHash.indexOf(' ');
      if (spaceIndex !== -1) {
         const helperName = afterHash.slice(0, spaceIndex);
         const paramQuery = afterHash.slice(spaceIndex + 1).trim();

         // Parse the param query for path navigation
         const parsed = parseExpressionText(paramQuery, basePath);

         return {
            type: 'blockHelperParam',
            helperName,
            query: parsed.query,
            basePath: parsed.basePath,
            parentLevels: parsed.parentLevels,
         };
      }

      // No space yet - still typing helper name
      return {
         type: 'blockHelper',
         query: afterHash,
         basePath: '',
         parentLevels: 0,
      };
   }

   // Check for private variable (starts with @)
   if (trimmed.startsWith('@')) {
      return {
         type: 'privateVar',
         query: trimmed.slice(1), // Remove @
         basePath: '',
         parentLevels: 0,
      };
   }

   // Regular field or helper
   const parsed = parseExpressionText(trimmed);
   return {
      type: parsed.basePath || parsed.parentLevels > 0 ? 'field' : 'all', // If there's a path or parent nav, it's field navigation
      query: parsed.query,
      basePath: parsed.basePath,
      parentLevels: parsed.parentLevels,
   };
}

// Handle private variable selection
export function handlePrivateVarSelect(editor: Editor,
   range: Range,
   pv: PrivateVar) {
   const insertText = `{{${pv.name}`;

   editor
      .chain()
      .focus()
      // .deleteRange(range)
      .insertContent(insertText)
      .run();
}

// Handle field selection
export function handleFieldSelect(editor: Editor,
   range: Range,
   suggestion: FieldSuggestion,
   basePath: string,
   parentLevels: number = 0) {
   const $position = editor.state.selection.$from;
   const textAfterCursor = $position.parent.textContent.slice($position.parentOffset);
   const nextCloseBrace = textAfterCursor.indexOf("}}");
   const from = $position.pos;
   const to = from + nextCloseBrace;

   // Build the ../ prefix for parent context navigation
   const parentPrefix = '../'.repeat(parentLevels);

   if (suggestion.type === "object" && isNestedObject(suggestion.value)) {
      const insertText = basePath
         ? `{{${parentPrefix}${basePath}.${suggestion.name}.`
         : `{{${parentPrefix}${suggestion.name}.`;

      editor
         .chain()
         .focus()
         .deleteRange({ from, to })
         .insertContent(insertText)
         .run();
      return;
   }

   const insertPath = formatFieldPath(suggestion);
   const fullText = `{{${parentPrefix}${insertPath}`;

   editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(fullText)
      .run();
}

