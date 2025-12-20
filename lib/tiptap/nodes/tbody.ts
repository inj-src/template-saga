import { Node, mergeAttributes } from '@tiptap/react'

export interface TbodyOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Tbody = Node.create<TbodyOptions>({
   name: 'tableBody',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   content: 'tableRow+',

   parseHTML() {
      return [{ tag: 'tbody' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['tbody', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Tbody
