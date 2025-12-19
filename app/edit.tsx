import { useEffect, useRef } from "react";
type props = { htmlString: string | null; setHtmlString: (html: string) => void };

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'


export function Edit({ htmlString, setHtmlString }: props) {
  // const ref = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   const element = ref.current;
  //   return () => {
  //     if(element) setHtmlString(element.innerHTML);
  //   }
  // }, [setHtmlString])

  const editor = useEditor({
    extensions: [StarterKit],
    content: htmlString || '<p>Hello World! 🌎️</p>',
    // Don't render immediately on the server to avoid SSR issues
    shouldRerenderOnTransaction: false,
    immediatelyRender: false,
  })

  return <EditorContent editor={editor} />

}