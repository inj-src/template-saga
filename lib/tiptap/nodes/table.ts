import { Node, mergeAttributes } from '@tiptap/react'

export interface TableOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Table = Node.create<TableOptions>({
   name: 'table',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: '(colgroup | tableRow | tableBody)+',

   isolating: true,

   parseHTML() {
      return [{ tag: 'table' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['table', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Table
