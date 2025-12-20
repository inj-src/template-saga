import { Node, mergeAttributes } from '@tiptap/react'

export interface LiOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Li = Node.create<LiOptions>({
   name: 'listItem',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   content: 'block+',

   defining: true,

   parseHTML() {
      return [{ tag: 'li' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['li', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Li
