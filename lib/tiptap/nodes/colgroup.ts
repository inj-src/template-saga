import { Node, mergeAttributes } from '@tiptap/react'

export interface ColgroupOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Colgroup = Node.create<ColgroupOptions>({
   name: 'colgroup',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   content: 'col*',

   parseHTML() {
      return [{ tag: 'colgroup' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['colgroup', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Colgroup
