import { Node, mergeAttributes } from '@tiptap/react'

export interface ColOptions {
   HTMLAttributes: Record<string, unknown>
}


export const Col = Node.create<ColOptions>({
   name: 'col',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   // col is a void/self-closing element inside colgroup
   inline: false,

   selectable: false,

   addAttributes() {
      return {
         span: {
            default: null,
         },
         width: {
            default: null,
         },
         style: {
            default: null,
            parseHTML: (element) => element.getAttribute('style'),
            renderHTML: (attributes) => {
               if (!attributes.style) return {}
               return { style: attributes.style }
            },
         },
      }
   },

   parseHTML() {
      return [{ tag: 'col' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['col', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
   },
})

export default Col
