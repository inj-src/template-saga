import { Node, mergeAttributes } from '@tiptap/react'

export interface WbrOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Wbr = Node.create<WbrOptions>({
   name: 'wbr',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'inline',

   inline: true,

   selectable: false,

   parseHTML() {
      return [{ tag: 'wbr' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['wbr', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
   },
})

export default Wbr
