import { Node, mergeAttributes } from '@tiptap/react'

export interface HeaderOptions {
   HTMLAttributes: Record<string, unknown>
}


export const Header = Node.create<HeaderOptions>({
   name: 'header',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: 'block+',

   defining: true,

   parseHTML() {
      return [{ tag: 'header' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['header', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },

})

export default Header
