import { Node, mergeAttributes } from '@tiptap/react'

export interface TrOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Tr = Node.create<TrOptions>({
   name: 'tableRow',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   content: 'tableCell+',

   parseHTML() {
      return [{ tag: 'tr' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['tr', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Tr
