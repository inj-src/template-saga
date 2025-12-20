import { Node, mergeAttributes } from '@tiptap/react'

export interface SpanOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Span = Node.create<SpanOptions>({
   name: 'span',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'inline',

   inline: true,

   content: 'inline*',

   whitespace: 'pre',

   parseHTML() {
      return [{ tag: 'span' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Span
