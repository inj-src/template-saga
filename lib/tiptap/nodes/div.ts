import { Node, mergeAttributes } from '@tiptap/react'

export interface DivOptions {
   HTMLAttributes: Record<string, unknown>
}


export const Div = Node.create<DivOptions>({
   name: 'div',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: 'block+',

   defining: true,

   parseHTML() {
      return [{ tag: 'div' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },


})

export default Div
