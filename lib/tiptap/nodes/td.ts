import { Node, mergeAttributes } from '@tiptap/react'

export interface TdOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Td = Node.create<TdOptions>({
   name: 'tableCell',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   content: 'block+',

   isolating: true,

   addAttributes() {
      return {
         colspan: {
            default: 1,
         },
         rowspan: {
            default: 1,
         },
      }
   },

   parseHTML() {
      return [{ tag: 'td' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['td', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Td
