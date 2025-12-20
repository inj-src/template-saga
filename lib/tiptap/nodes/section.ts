import { Node, mergeAttributes } from '@tiptap/react'

export interface SectionOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Section = Node.create<SectionOptions>({
   name: 'section',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: 'block+',

   defining: true,

   parseHTML() {
      return [{ tag: 'section' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['section', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },

})

export default Section
