import { useEffect } from "react";

import { useEditor, EditorContent } from '@tiptap/react'
import { KeepAttributes } from "@/lib/tiptap/keep-attributes";
import { nodes, NODE_NAMES } from "@/lib/tiptap/nodes";
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { HandlebarsSuggestion } from "@/lib/tiptap/handlebars-suggestion/handlebars-suggestion";

type EditProps = {
  htmlString: string | null;
  setHtmlString: (html: string) => void;
  data: unknown;
};

export function Edit({ htmlString, setHtmlString, data }: EditProps) {
  const editor = useEditor({
    extensions: [
      TextStyleKit,
      StarterKit,
      KeepAttributes.configure({
        types: [...NODE_NAMES, 'paragraph', 'table', 'tableRow', 'tableHeader', 'tableCell', 'tableBody'],
      }),
      ...nodes,

    ],
    editorProps: {
      attributes: {
        class: 'w-max mx-auto [&_section]:outline-1 [&_section]:outline-stone-300 [&_section]:shadow-sn space-y-4 my-4',
      },
    },
    content: htmlString || '<p>Hello World! 🌎️</p>',
    // injectCSS: false,
    shouldRerenderOnTransaction: false,
    immediatelyRender: false,
    enableContentCheck: true,
    onContentError: ({ error }) => {
      console.log(error)
    }
  })

  useEffect(() => {
    let savedHtml = htmlString || '';
    editor?.on('update', () => {
      savedHtml = editor.getHTML();
    })
    return () => {
      editor?.destroy();
      setHtmlString(savedHtml);
    }
  }, [editor, setHtmlString, htmlString])

  return (
    <>
      <EditorContent editor={editor} />
      <HandlebarsSuggestion editor={editor} data={data} />
    </>
  )


}