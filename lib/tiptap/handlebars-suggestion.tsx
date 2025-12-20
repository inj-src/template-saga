"use client";

import {
   Type,
   Hash,
   ToggleLeft,
   Folder,
   List,
   HelpCircle,
} from "lucide-react";
import type { Editor, Range } from "@tiptap/react";

import { SuggestionMenu } from "@/components/tiptap-ui-utils/suggestion-menu";
import type { SuggestionItem, SuggestionMenuRenderProps } from "@/components/tiptap-ui-utils/suggestion-menu";
import {
   FieldSuggestion,
   FieldType,
   getSuggestionsAtPath,
   parseExpressionText,
   formatFieldPath,
   isNestedObject,
} from "@/lib/tiptap/json-field-suggestions";
import { cn } from "@/lib/tiptap-utils";

// Type for the suggestion match from @tiptap/suggestion
type SuggestionMatch = {
   range: Range;
   query: string;
   text: string;
} | null;

// Trigger config from @tiptap/suggestion
interface Trigger {
   char: string;
   allowSpaces: boolean;
   allowToIncludeChar: boolean;
   allowedPrefixes: string[] | null;
   startOfLine: boolean;
   $position: {
      pos: number;
      nodeBefore: { isText: boolean; text?: string } | null;
      parent: { textContent: string };
      parentOffset: number;
   };
}

// Icon mapping for field types
const TYPE_ICONS: Record<FieldType, React.ReactNode> = {
   string: <Type className="w-4 h-4 text-emerald-500" />,
   number: <Hash className="w-4 h-4 text-blue-500" />,
   boolean: <ToggleLeft className="w-4 h-4 text-amber-500" />,
   object: <Folder className="w-4 h-4 text-purple-500" />,
   array: <List className="w-4 h-4 text-orange-500" />,
   null: <HelpCircle className="w-4 h-4 text-gray-400" />,
   undefined: <HelpCircle className="w-4 h-4 text-gray-400" />,
};

interface HandlebarsSuggestionProps {
   editor: Editor | null;
   data: unknown;
}

// Custom suggestion item that includes our field data
interface FieldSuggestionItem extends SuggestionItem<FieldSuggestion> {
   fieldData: FieldSuggestion;
}

/**
 * Custom findSuggestionMatch that detects when cursor is inside {{ }}
 * and returns the text between {{ and cursor as the query.
 */
function findHandlebarsMatch(config: Trigger): SuggestionMatch {
   const { $position } = config;

   // Get text content before cursor from the text node
   const text = $position.nodeBefore?.isText && $position.nodeBefore.text;

   if (!text) {
      return null;
   }
   // Find the last {{ that doesn't have a closing }}
   const lastOpenBrace = text.lastIndexOf("{{");
   const lastCloseBrace = text.lastIndexOf("}}");

   // console.log(text, lastOpenBrace, lastCloseBrace)
   // Must have {{ and it must come after any }}
   if (lastOpenBrace === -1 || lastCloseBrace > lastOpenBrace) {
      return null;
   }

   // Check if there's a }} after cursor in the parent
   const textAfterCursor = $position.parent.textContent.slice($position.parentOffset);
   const nextCloseBrace = textAfterCursor.indexOf("}}");
   const nextOpenBrace = textAfterCursor.indexOf("{{");

   // Must have }} after cursor, and no {{ before it
   if (nextCloseBrace === -1 || (nextOpenBrace !== -1 && nextOpenBrace < nextCloseBrace)) {
      return null;
   }

   // Extract the query text (everything between {{ and cursor)
   const query = text.slice(lastOpenBrace + 2);

   // Calculate the range - from {{ to cursor position
   const textFrom = $position.pos - text.length;
   const from = textFrom + lastOpenBrace; // From {{
   const to = $position.pos; // Cursor position

   return {
      range: { from, to },
      query,
      text: text.slice(lastOpenBrace),
   };
}

export function HandlebarsSuggestion({
   editor,
   data,
}: HandlebarsSuggestionProps) {

   // Generate suggestion items based on query
   const getSuggestionItems = async ({ query }: { query: string; editor: Editor }) => {
      if (!data) return [];

      const parsed = parseExpressionText(query);
      const allSuggestions = getSuggestionsAtPath(data, parsed.basePath);

      // Filter by query
      const filtered = parsed.query
         ? allSuggestions.filter((s) =>
            s.name.toLowerCase().startsWith(parsed.query.toLowerCase())
         )
         : allSuggestions;

      // Map to SuggestionItem format
      return filtered.map((suggestion): FieldSuggestionItem => ({
         title: suggestion.name,
         subtext: suggestion.type,
         context: suggestion,
         fieldData: suggestion,
         onSelect: ({ editor, range }) => {
            handleFieldSelect(editor, range, suggestion, parsed.basePath);
         },
      }));
   };

   // Handle field selection
   const handleFieldSelect = (
      editor: Editor,
      range: Range,
      suggestion: FieldSuggestion,
      basePath: string
   ) => {
      // If it's an object, insert field name with dot to continue navigation
      if (suggestion.type === "object" && isNestedObject(suggestion.value)) {
         const insertText =
            basePath
               ? `{{${basePath}.${suggestion.name}.`
               : `{{${suggestion.name}.`;

         editor
            .chain()
            .focus()
            // .deleteRange(range)
            .insertContent(insertText)
            .run();
         return;
      }

      // For primitives and arrays, insert the full path with closing braces
      const insertPath = formatFieldPath(suggestion);
      const fullText =
         // basePath
         //    ? `{{${basePath}.${insertPath}`
         //    :
         `{{${insertPath}`;

      editor
         .chain()
         .focus()
         // .deleteRange(range)
         .insertContent(fullText)
         .run();
   };

   // Render the suggestion list
   const renderSuggestionList = ({
      items,
      selectedIndex,
      onSelect,
   }: SuggestionMenuRenderProps<FieldSuggestion>) => {
      if (items.length === 0) {
         return (
            <div className="p-3 text-sm text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
               No matching fields
            </div>
         );
      }

      return (
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-y-auto max-h-[300px]">
               {items.map((item, index) => {
                  const fieldItem = item as FieldSuggestionItem;
                  return (
                     <div
                        key={fieldItem.fieldData?.path || item.title}
                        role="option"
                        aria-selected={index === selectedIndex}
                        className={cn(
                           "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors",
                           index === selectedIndex
                              ? "bg-slate-100 dark:bg-slate-800"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                        onClick={() => onSelect(item)}
                     >
                        <span className="shrink-0">
                           {fieldItem.fieldData ? TYPE_ICONS[fieldItem.fieldData.type] : null}
                        </span>
                        <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                           {item.title}
                        </span>
                        {fieldItem.fieldData?.type === "object" && (
                           <span className="ml-auto text-xs text-slate-400">›</span>
                        )}
                        {fieldItem.fieldData?.type === "array" && (
                           <span className="ml-auto text-xs text-slate-400">[]</span>
                        )}
                     </div>
                  );
               })}
            </div>
         </div>
      );
   };

   return (
      <SuggestionMenu
         editor={editor}
         char="{{"
         pluginKey="handlebarsSuggestion"
         items={getSuggestionItems}
         findSuggestionMatch={findHandlebarsMatch}
         allowSpaces={true}
         allowedPrefixes={null}
      >
         {renderSuggestionList}
      </SuggestionMenu>
   );
}
