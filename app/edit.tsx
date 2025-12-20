import { useEffect } from "react";
type props = { htmlString: string | null; setHtmlString: (html: string) => void };

import { useEditor, EditorContent } from '@tiptap/react'
import { extractNodeNames, KeepAttributes } from "@/lib/tiptap/keep-attributes";
import Document from '@tiptap/extension-document'
import { nodes } from "@/lib/tiptap/nodes";
import Text from '@tiptap/extension-text'
import { UndoRedo } from '@tiptap/extensions'

export function Edit({ htmlString, setHtmlString }: props) {

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      UndoRedo,

      KeepAttributes.configure({
        types: extractNodeNames(nodes),
      }),
      ...nodes,
    ],
    editorProps: {
      attributes: {
        class: 'w-max mx-auto [&_section]:outline-1 [&_section]:outline-stone-300 [&_section]:shadow-sn space-y-4 my-4',
      },
    },
    content: htmlString || '<p>Hello World! 🌎️</p>',
    injectCSS: false,
    // editable: false,
    shouldRerenderOnTransaction: false,
    immediatelyRender: false,
    enableContentCheck: true,
    onContentError: ({ error }) => {
      console.log(error)
    }
  })

  useEffect(() => {
    let savedHtml = '';
    editor?.on('update', () => {
      savedHtml = editor.getHTML();
    })
    return () => {
      editor?.destroy();
      setHtmlString(savedHtml);
    }
  }, [editor, setHtmlString])

  return (
    <EditorContent editor={editor} />
  )


}