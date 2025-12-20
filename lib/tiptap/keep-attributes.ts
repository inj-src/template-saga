import { Extension, Node } from '@tiptap/react'

export function extractNodeNames(nodes: Node[]) {
   return nodes.map((node) => node.name)
}

export const KeepAttributes = Extension.create({
   name: 'keepAttributes',
   addOptions() {
      return {
         types: []
      }
   },

   addGlobalAttributes() {
      return [
         {
            types: this.options.types,
            attributes: {
               class: {
                  default: null,
                  renderHTML: (attributes) => {
                     if (!attributes.class) return {}
                     return { class: attributes.class }
                  },
                  parseHTML: (element) => element.getAttribute('class'),
               },
            },
         },
         {
            types: this.options.types,
            attributes: {
               style: {
                  default: null,
                  renderHTML: (attributes) => {
                     if (!attributes.style) return {}
                     return { style: attributes.style }
                  },
                  parseHTML: (element) => element.getAttribute('style'),
               },
            },
         },
      ]
   },
})