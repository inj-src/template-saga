"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";

interface CodeEditorProps {
   value: string;
   onChange?: (value: string) => void;
   className?: string;
}

export function CodeEditor({ value, onChange, className }: CodeEditorProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const viewRef = useRef<EditorView | null>(null);

   useEffect(() => {
      if (!containerRef.current) return;

      const state = EditorState.create({
         doc: value,
         extensions: [
            lineNumbers(),
            highlightActiveLine(),
            history(),
            bracketMatching(),
            closeBrackets(),
            javascript(),
            syntaxHighlighting(defaultHighlightStyle),
            keymap.of([
               ...defaultKeymap,
               ...historyKeymap,
               ...closeBracketsKeymap,
            ]),
            EditorView.updateListener.of((update) => {
               if (update.docChanged && onChange) {
                  onChange(update.state.doc.toString());
               }
            }),
            EditorView.theme({
               "&": {
                  height: "100%",
                  fontSize: "13px",
               },
               ".cm-scroller": {
                  overflow: "auto",
               },
               ".cm-content": {
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
               },
               ".cm-gutters": {
                  backgroundColor: "#f5f5f5",
                  borderRight: "1px solid #e0e0e0",
               },
            }),
         ],
      });

      const view = new EditorView({
         state,
         parent: containerRef.current,
      });

      viewRef.current = view;

      return () => {
         view.destroy();
         viewRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // Sync external value changes
   useEffect(() => {
      const view = viewRef.current;
      if (!view) return;

      const currentValue = view.state.doc.toString();
      if (currentValue !== value) {
         view.dispatch({
            changes: {
               from: 0,
               to: currentValue.length,
               insert: value,
            },
         });
      }
   }, [value]);

   return (
      <div
         ref={containerRef}
         className={className}
         style={{ border: "1px solid #e0e0e0", borderRadius: "6px", overflow: "hidden" }}
      />
   );
}
