import { Node, mergeAttributes } from '@tiptap/react'

export interface ForeignObjectOptions {
   HTMLAttributes: Record<string, unknown>
}


export const ForeignObject = Node.create<ForeignObjectOptions>({
   name: 'foreignObject',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: 'block*',

   defining: true,

   parseHTML() {
      return [{ tag: 'foreignObject' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['foreignObject', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },


})

export default ForeignObject
