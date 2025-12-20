import { Node, mergeAttributes } from '@tiptap/react'

export interface ImgOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Img = Node.create<ImgOptions>({
   name: 'image',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'inline',

   inline: true,

   draggable: true,

   addAttributes() {
      return {
         src: {
            default: null,
         },
         alt: {
            default: null,
         },
         title: {
            default: null,
         },
         width: {
            default: null,
         },
         height: {
            default: null,
         },
      }
   },

   parseHTML() {
      return [{ tag: 'img[src]' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
   },
})

export default Img
