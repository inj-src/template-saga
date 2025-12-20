import { Node, mergeAttributes } from '@tiptap/react'

export interface SupOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Sup = Node.create<SupOptions>({
   name: 'superscript',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'inline',

   inline: true,

   content: 'inline*',

   parseHTML() {
      return [{ tag: 'sup' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['sup', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Sup
