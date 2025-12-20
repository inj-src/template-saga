import { Node, mergeAttributes } from '@tiptap/react'

export interface ParagraphOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Paragraph = Node.create<ParagraphOptions>({
   name: 'paragraph',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: 'inline*',

   parseHTML() {
      return [{ tag: 'p' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Paragraph
