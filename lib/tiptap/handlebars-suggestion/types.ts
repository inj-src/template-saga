import { Editor } from "@tiptap/react";
import type { SuggestionItem } from "@/components/tiptap-ui-utils/suggestion-menu";


/**
 * Parse the query to understand what kind of suggestions to show
 */
export interface ExpressionContext {
   type: 'field' | 'blockHelper' | 'privateVar' | 'all';
   query: string;
   basePath: string;
}

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
}

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