import { Node, mergeAttributes } from '@tiptap/react'

export interface BrOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Br = Node.create<BrOptions>({
   name: 'hardBreak',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'inline',

   inline: true,

   selectable: false,

   parseHTML() {
      return [{ tag: 'br' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['br', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
   },
})

export default Br
