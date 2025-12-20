import { Node, mergeAttributes } from '@tiptap/react'

export interface OlOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Ol = Node.create<OlOptions>({
   name: 'orderedList',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: 'listItem+',

   addAttributes() {
      return {
         start: {
            default: 1,
         },
         type: {
            default: null,
         },
      }
   },

   parseHTML() {
      return [{ tag: 'ol' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['ol', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Ol
