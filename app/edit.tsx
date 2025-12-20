import { useEffect, useRef } from "react";
type props = { htmlString: string | null; setHtmlString: (html: string) => void };

import { useEditor, EditorContent } from '@tiptap/react'
import { extractNodeNames, KeepAttributes } from "@/lib/tiptap/keep-attributes";
import Document from '@tiptap/extension-document'
import { nodes } from "@/lib/tiptap/nodes";
import Text from '@tiptap/extension-text'

export function Edit({ htmlString, setHtmlString }: props) {

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      KeepAttributes.configure({
        types: extractNodeNames(nodes),
      }),
      ...nodes,
    ],
    content: htmlString || '<p>Hello World! 🌎️</p>',
    injectCSS: false,
    editable: false,
    shouldRerenderOnTransaction: false,
    immediatelyRender: false,
    enableContentCheck: true,
    onContentError: ({ editor, error }) => {
      console.log(error)
    }
  })


  return <EditorContent editor={editor} />

}