import { Node, mergeAttributes } from '@tiptap/react'

export interface StyleOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Style = Node.create<StyleOptions>({
   name: 'style',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: 'text*',

   marks: '',

   parseHTML() {
      return [{ tag: 'style' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['style', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },
})

export default Style
