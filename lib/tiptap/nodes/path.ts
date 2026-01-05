import { Node, mergeAttributes } from '@tiptap/react'

export interface PathOptions {
   HTMLAttributes: Record<string, unknown>
}


export const Path = Node.create<PathOptions>({
   name: 'path',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: '',

   defining: true,

   parseHTML() {
      return [{ tag: 'path' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['path', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
   },


})

export default Path
