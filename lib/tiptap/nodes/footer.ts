import { Node, mergeAttributes } from '@tiptap/react'

export interface FooterOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Footer = Node.create<FooterOptions>({
   name: 'footer',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: 'block+',

   defining: true,

   parseHTML() {
      return [{ tag: 'footer' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['footer', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },

})

export default Footer
