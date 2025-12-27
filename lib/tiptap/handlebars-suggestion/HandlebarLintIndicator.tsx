"use client";

import { useCallback, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import { lintHandlebarsBlocks, type LintError } from "./handlebars-linter";

import { Button } from "@/components/tiptap-ui-primitive/button";
import { Badge } from "@/components/tiptap-ui-primitive/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/tiptap-ui-primitive/popover";
import { Card, CardHeader, CardBody } from "@/components/tiptap-ui-primitive/card";
import { AlertTriangleIcon } from "lucide-react";

import "./HandlebarLintIndicator.scss";

interface HandlebarLintIndicatorProps {
   editor: Editor | null;
}

export function HandlebarLintIndicator({ editor }: HandlebarLintIndicatorProps) {
   const [errors, setErrors] = useState<LintError[]>([]);

   const runLint = useCallback(() => {
      if (!editor) {
         setErrors([]);
         return;
      }

      const text = editor.getText();
      const lintErrors = lintHandlebarsBlocks(text);
      setErrors(lintErrors);
   }, [editor]);

   useEffect(() => {
      if (!editor) return;

      // Initial lint (deferred to avoid synchronous setState in effect)
      queueMicrotask(runLint);

      // Re-lint on content change
      editor.on("update", runLint);

      return () => {
         editor.off("update", runLint);
      };
   }, [editor, runLint]);

   if (errors.length === 0) return null;

   return (
      <div className="handlebar-lint-indicator">
         <Popover>
            <PopoverTrigger asChild>
               <Button
                  data-style="ghost"
                  className="handlebar-lint-trigger"
                  tooltip="Handlebars lint warnings"
               >
                  <AlertTriangleIcon width={14} height={14} />
                  <span className="tiptap-button-text">
                     {errors.length} {errors.length === 1 ? "error" : "errors"}
                  </span>
               </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end">
               <Card >
                  <CardHeader>Lint Errors</CardHeader>
                  <CardBody className="handlebar-lint-body">
                     <ul className="handlebar-lint-list">
                        {errors.map((err, i) => (
                           <li key={i} className="handlebar-lint-item">
                              <Badge
                                 size="small"
                                 className={`handlebar-lint-badge handlebar-lint-badge--${err.type}`}
                              >
                                 {err.type}
                              </Badge>
                              <span className="handlebar-lint-message">{err.message}</span>
                           </li>
                        ))}
                     </ul>
                  </CardBody>
               </Card>
            </PopoverContent>
         </Popover>
      </div>
   );
}

