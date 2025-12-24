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

export function parseQueryContext(query: string): ExpressionContext {
   const trimmed = query.trim();

   // Check for block helper context (starts with #)
   if (trimmed.startsWith('#')) {
      return {
         type: 'blockHelper',
         query: trimmed.slice(1), // Remove #
         basePath: '',
      };
   }

   // Check for private variable (starts with @)
   if (trimmed.startsWith('@')) {
      return {
         type: 'privateVar',
         query: trimmed.slice(1), // Remove @
         basePath: '',
      };
   }

   // Regular field or helper
   const parsed = parseExpressionText(trimmed);
   return {
      type: parsed.basePath ? 'field' : 'all', // If there's a path, it's field navigation
      query: parsed.query,
      basePath: parsed.basePath,
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
   basePath: string) {
   const $position = editor.state.selection.$from;
   const textAfterCursor = $position.parent.textContent.slice($position.parentOffset);
   const nextCloseBrace = textAfterCursor.indexOf("}}");
   const from = $position.pos;
   const to = from + nextCloseBrace;

   if (suggestion.type === "object" && isNestedObject(suggestion.value)) {
      const insertText = basePath
         ? `{{${basePath}.${suggestion.name}.`
         : `{{${suggestion.name}.`;

      editor
         .chain()
         .focus()
         .deleteRange({ from, to })
         .insertContent(insertText)
         .run();
      return;
   }

   const insertPath = formatFieldPath(suggestion);
   const fullText = `{{${insertPath}`;

   editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(fullText)
      .run();
}

