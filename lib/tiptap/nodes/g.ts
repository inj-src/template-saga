import { Node, mergeAttributes } from '@tiptap/react'

export interface GOptions {
   HTMLAttributes: Record<string, unknown>
}


export const G = Node.create<GOptions>({
   name: 'g',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: 'block*',

   defining: true,

   parseHTML() {
      return [{ tag: 'g' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['g', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },


})

export default G
