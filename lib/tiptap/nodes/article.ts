import { Node, mergeAttributes } from '@tiptap/react'

export interface ArticleOptions {
   HTMLAttributes: Record<string, unknown>
}

export const Article = Node.create<ArticleOptions>({
   name: 'article',

   addOptions() {
      return {
         HTMLAttributes: {},
      }
   },

   group: 'block',

   content: 'block+',

   defining: true,

   parseHTML() {
      return [{ tag: 'article' }]
   },

   renderHTML({ HTMLAttributes }) {
      return ['article', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
   },


})

export default Article
