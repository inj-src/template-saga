import { Node, mergeAttributes } from '@tiptap/react'

export interface SubOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Sub = Node.create<SubOptions>({
   name: 'subscript',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'inline',

   inline: true,

   content: 'inline*',

   parseHTML() {
      return [{ tag: 'sub' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['sub', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Sub
