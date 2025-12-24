"use client";

import type { Editor } from "@tiptap/react";
import { useEffect, useRef } from "react";

import { SuggestionMenu } from "@/components/tiptap-ui-utils/suggestion-menu";
import type { SuggestionItem, SuggestionMenuRenderProps } from "@/components/tiptap-ui-utils/suggestion-menu";
import {
   FieldSuggestion,
   FieldType,
   getSuggestionsAtPath,
} from "@/lib/tiptap/handlebars-suggestion/json-field-suggestions";
import {
   ALL_HELPERS,
   getBlockHelpers,
   COMMON_PRIVATE_VARS,
   type HelperDefinition,
   type PrivateVar,
} from "@/lib/tiptap/handlebars-suggestion/helper-definitions";
import { handleFieldSelect, handleHelperSelect, handlePrivateVarSelect, parseQueryContext } from "./utils";
import { SuggestionMatch, Trigger } from "@tiptap/suggestion";

// Icons
import { TextColorSmallIcon } from "@/components/tiptap-icons/text-color-small-icon";
import { ListOrderedIcon } from "@/components/tiptap-icons/list-ordered-icon";
import { SquareXIcon } from "@/components/tiptap-icons/square-x-icon";
import { TableIcon } from "@/components/tiptap-icons/table-icon";
import { ListIcon } from "@/components/tiptap-icons/list-icon";
import { CloseIcon } from "@/components/tiptap-icons/close-icon";
import { Code2Icon } from "@/components/tiptap-icons/code2-icon";
import { CodeBlockIcon } from "@/components/tiptap-icons/code-block-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";
import { Button, ButtonGroup } from "@/components/tiptap-ui-primitive/button";
import { Card, CardBody, CardGroupLabel, CardItemGroup } from "@/components/tiptap-ui-primitive/card";

// Icon mapping for field types -> Tiptap Icons
const TYPE_ICONS: Record<FieldType, React.ReactNode> = {
   string: <TextColorSmallIcon width={14} height={14} />,
   number: <ListOrderedIcon width={14} height={14} />,
   boolean: <SquareXIcon width={14} height={14} />,
   object: <TableIcon width={14} height={14} />,
   array: <ListIcon width={14} height={14} />,
   null: <CloseIcon width={14} height={14} />,
   undefined: <CloseIcon width={14} height={14} />,
};

// Get icon for suggestion item
const getItemIcon = (item: AnySuggestionItem): React.ReactNode => {
   switch (item.category) {
      case 'field':
         return TYPE_ICONS[(item as FieldSuggestionItem).fieldData.type];
      case 'helper':
         return <Code2Icon width={14} height={14} style={{ color: '#0ea5e9' }} />; // Sky blue
      case 'blockHelper':
         return <CodeBlockIcon width={14} height={14} style={{ color: '#ec4899' }} />; // Pink
      case 'privateVar':
         return <LinkIcon width={14} height={14} style={{ color: '#8b5cf6' }} />; // Violet
      default:
         return <CloseIcon width={14} height={14} />;
   }
};

// Suggestion types
type SuggestionCategory = 'field' | 'helper' | 'blockHelper' | 'privateVar' | 'hashParam';

interface BaseSuggestionItem extends SuggestionItem {
   category: SuggestionCategory;
}

interface FieldSuggestionItem extends BaseSuggestionItem {
   category: 'field';
   fieldData: FieldSuggestion;
}

interface HelperSuggestionItem extends BaseSuggestionItem {
   category: 'helper' | 'blockHelper';
   helperData: HelperDefinition;
}

interface PrivateVarSuggestionItem extends BaseSuggestionItem {
   category: 'privateVar';
   varData: PrivateVar;
}

type AnySuggestionItem = FieldSuggestionItem | HelperSuggestionItem | PrivateVarSuggestionItem;

interface HandlebarsSuggestionProps {
   editor: Editor | null;
   data: unknown;
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


   // Calculate the range - from {{ to }} position
   const textFrom = $position.pos - text.length;
   const from = textFrom + lastOpenBrace;
   const to = $position.pos + nextCloseBrace;

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
   const getSuggestionItems = async ({ query }: { query: string; editor: Editor }): Promise<AnySuggestionItem[]> => {
      const context = parseQueryContext(query);
      const items: AnySuggestionItem[] = [];

      // Block helper suggestions (after #)
      if (context.type === 'blockHelper') {
         const blockHelpers = getBlockHelpers();
         const filtered = context.query
            ? blockHelpers.filter((h) =>
               h.name.toLowerCase().startsWith(context.query.toLowerCase())
            )
            : blockHelpers;

         const singleItemAndCompletelyMatchingQuery = filtered.length === 1 && filtered[0].name.toLowerCase() === context.query.toLowerCase();
         if (singleItemAndCompletelyMatchingQuery) return [];

         items.push(
            ...filtered.map((helper): HelperSuggestionItem => ({
               title: helper.name,
               subtext: helper.description,
               category: 'blockHelper',
               helperData: helper,
               onSelect: ({ editor, range }) => {
                  handleHelperSelect(editor, range, helper, true);
               },
            }))
         );
         return items;
      }

      // Private variable suggestions (after @)
      if (context.type === 'privateVar') {
         const filtered = context.query
            ? COMMON_PRIVATE_VARS.filter((v) =>
               v.name.slice(1).toLowerCase().startsWith(context.query.toLowerCase())
            )
            : COMMON_PRIVATE_VARS;

         const singleItemAndCompletelyMatchingQuery = filtered.length === 1 && filtered[0].name.toLowerCase() === context.query.toLowerCase();
         if (singleItemAndCompletelyMatchingQuery) return [];

         items.push(
            ...filtered.map((pv): PrivateVarSuggestionItem => ({
               title: pv.name,
               subtext: pv.desc,
               category: 'privateVar',
               varData: pv,
               onSelect: ({ editor, range }) => {
                  handlePrivateVarSelect(editor, range, pv);
               },
            }))
         );
         return items;
      }

      // Field suggestions
      if (data && (context.type === 'field' || context.type === 'all')) {
         const allFieldSuggestions = getSuggestionsAtPath(data, context.basePath);
         const filteredFields = context.query
            ? allFieldSuggestions.filter((s) =>
               s.name.toLowerCase().startsWith(context.query.toLowerCase())
            )
            : allFieldSuggestions;

         items.push(
            ...filteredFields.map((suggestion): FieldSuggestionItem => ({
               title: suggestion.name,
               subtext: suggestion.type,
               category: 'field',
               fieldData: suggestion,
               onSelect: ({ editor, range }) => {
                  handleFieldSelect(editor, range, suggestion, context.basePath);
               },
            }))
         );
      }

      // Helper suggestions (only at root level, no path navigation)
      if (context.type === 'all') {
         const filteredHelpers = context.query
            ? ALL_HELPERS.filter((h) =>
               h.name.toLowerCase().startsWith(context.query.toLowerCase())
            )
            : ALL_HELPERS;

         items.push(
            ...filteredHelpers.map((helper): HelperSuggestionItem => ({
               title: helper.name,
               subtext: helper.description,
               category: helper.type === 'block' ? 'blockHelper' : 'helper',
               helperData: helper,
               onSelect: ({ editor, range }) => {
                  handleHelperSelect(editor, range, helper, false);
               },
            }))
         );
      }

      const singleItemAndCompletelyMatchingQuery = items.length === 1 && items[0].title.toLowerCase() === context.query.toLowerCase();
      if (singleItemAndCompletelyMatchingQuery) return [];

      return items;
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
      // manualDeletion={true}
      >
         {(props) => <HandlebarsSuggestionList {...props} />}
      </SuggestionMenu>
   );
}


function HandlebarsSuggestionList({
   items,
   selectedIndex,
   onSelect,
}: SuggestionMenuRenderProps) {
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (selectedIndex === undefined || !containerRef.current) return;

      const activeItem = containerRef.current.querySelector(
         `[data-highlighted="true"]`
      );

      if (activeItem) {

         activeItem.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
         });
      }
   }, [selectedIndex]);

   if (items.length === 0) {
      return null;
   }

   // Group items by category
   const fields = items.filter((i) => (i as AnySuggestionItem).category === 'field');
   const helpers = items.filter((i) =>
      (i as AnySuggestionItem).category === 'helper' ||
      (i as AnySuggestionItem).category === 'blockHelper'
   );
   const privateVars = items.filter((i) => (i as AnySuggestionItem).category === 'privateVar');

   function renderItem(item: SuggestionItem, index: number) {
      const typedItem = item as AnySuggestionItem;
      const isSelected = index === selectedIndex;

      return (
         <Button
            key={item.title + index}
            role="option"
            aria-selected={isSelected}
            data-style="ghost"
            data-highlighted={selectedIndex === index}
            style={{ width: "100%", scrollMarginBlock: '100px', transitionDuration: '1ms' }}
            onClick={() => onSelect(item)}

         >
            {getItemIcon(typedItem)}
            <p className="tiptap-button-text">
               {item.title}
            </p>
         </Button>
      );
   }

   return (
      <Card >
         <CardBody ref={containerRef} style={{ minWidth: "230px", maxHeight: "400px", overflowY: "auto" }}>
            {fields.length > 0 && (
               <CardItemGroup>
                  {(helpers.length > 0 || privateVars.length > 0) && (
                     <CardGroupLabel>
                        Fields
                     </CardGroupLabel>
                  )}
                  <ButtonGroup>
                     {fields.map((item, i) => renderItem(item, items.indexOf(item)))}
                  </ButtonGroup>
               </CardItemGroup>
            )}

            {/* Helpers section */}
            {helpers.length > 0 && (
               <CardItemGroup>
                  {fields.length > 0 && (
                     <CardGroupLabel>
                        Helpers
                     </CardGroupLabel>
                  )}
                  <ButtonGroup>
                     {helpers.map((item, i) => renderItem(item, items.indexOf(item)))}
                  </ButtonGroup>
               </CardItemGroup>
            )}

            {/* Private vars section */}
            {privateVars.length > 0 && (
               <CardItemGroup>
                  {(fields.length > 0 || helpers.length > 0) && (
                     <CardGroupLabel>
                        Variables
                     </CardGroupLabel>
                  )}
                  <ButtonGroup>
                     {privateVars.map((item, i) => renderItem(item, items.indexOf(item)))}
                  </ButtonGroup>
               </CardItemGroup>
            )}
         </CardBody>
      </Card>
   );
};
