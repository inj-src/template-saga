import { Node, mergeAttributes } from '@tiptap/react'

export interface SvgOptions {
   HTMLAttributes: Record<string, unknown>
}


export const Svg = Node.create<SvgOptions>({
   name: 'svg',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: 'block*',

   defining: true,

   parseHTML() {
      return [{ tag: 'svg' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['svg', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },


})

export default Svg
