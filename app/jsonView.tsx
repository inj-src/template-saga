"use client";

import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
hljs.registerLanguage("json", json);
import "highlight.js/styles/stackoverflow-light.css";
import { useDataStore } from "./store/useDataStore";
import { useEffect, useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { toast } from "sonner";

/**
 * Walks the DOM and injects data-path attributes on value spans.
 * Tracks JSON structure to compute Handlebars-compatible paths.
 */
function injectDataPaths(container: HTMLElement): void {
  console.log('I ran');
  const pathStack: (string | number)[] = [];
  let lastKey: string | null = null;
  let inArray = false;
  const arrayIndexStack: number[] = [];
  const contextStack: ("object" | "array")[] = [];

  const walkNodes = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const text = el.textContent?.trim() ?? "";

      if (el.classList.contains("hljs-punctuation")) {
        if (text === "{") {
          if (lastKey !== null) {
            pathStack.push(lastKey);
            lastKey = null;
          } else if (inArray) {
            const idx = arrayIndexStack[arrayIndexStack.length - 1];
            pathStack.push(`[${idx}]`);
            arrayIndexStack[arrayIndexStack.length - 1]++;
          }
          contextStack.push("object");
        } else if (text === "}") {
          if (contextStack[contextStack.length - 1] === "object") {
            contextStack.pop();
            if (pathStack.length > 0) pathStack.pop();
          }
        } else if (text === "[") {
          if (lastKey !== null) {
            pathStack.push(lastKey);
            lastKey = null;
          } else if (inArray) {
            const idx = arrayIndexStack[arrayIndexStack.length - 1];
            pathStack.push(`[${idx}]`);
            arrayIndexStack[arrayIndexStack.length - 1]++;
          }
          contextStack.push("array");
          arrayIndexStack.push(0);
          inArray = true;
        } else if (text === "]") {
          if (contextStack[contextStack.length - 1] === "array") {
            contextStack.pop();
            arrayIndexStack.pop();
            inArray = arrayIndexStack.length > 0;
            if (pathStack.length > 0) pathStack.pop();
          }
        }
      } else if (el.classList.contains("hljs-attr")) {
        lastKey = text.replace(/^"|"$/g, "");
      } else if (
        el.classList.contains("hljs-string") ||
        el.classList.contains("hljs-number") ||
        el.classList.contains("hljs-literal")
      ) {
        const segments = [...pathStack];
        if (lastKey !== null) {
          segments.push(lastKey);
          lastKey = null;
        } else if (inArray) {
          const idx = arrayIndexStack[arrayIndexStack.length - 1];
          segments.push(`[${idx}]`);
          arrayIndexStack[arrayIndexStack.length - 1]++;
        }

        // Convert to Handlebars path format
        const path = segments
          .map((seg, i) => {
            if (typeof seg === "string" && seg.startsWith("[")) {
              return `.${seg}`;
            }
            return i === 0 ? seg : `.${seg}`;
          })
          .join("");

        if (path) {
          el.setAttribute("data-path", path);
          el.style.cursor = "pointer";
        }
      }

      // Recurse into children
      for (const child of Array.from(node.childNodes)) {
        walkNodes(child);
      }
    }
  };

  walkNodes(container);
}

export default function JSONView({ data }: { data: unknown }) {
  const { customFields } = useDataStore();
  const preRef = useRef<HTMLPreElement>(null);

  const highlightedHtml = useMemo(() => {
    const mergedData =
      data && typeof data === "object" && !Array.isArray(data)
        ? { ...data, customFields }
        : data;

    return hljs.highlight(JSON.stringify(mergedData, null, 1), { language: "json" }).value;
  }, [data, customFields]);

  // Inject data-path attributes after HTML is rendered
  useEffect(() => {
    if (preRef.current) {
      injectDataPaths(preRef.current);
    }
  });

  // Click handler for copying paths
  const handleClick = useCallback((e: React.MouseEvent<HTMLPreElement>) => {
    const target = e.target as HTMLElement;
    const path = target.getAttribute("data-path");
    if (path) {
      navigator.clipboard.writeText(path).then(() => {
        toast.success(`Copied: ${path}`);
      });
    }
  }, []);

  return (
    <pre
      ref={preRef}
      onClick={handleClick}
      className="rounded-md text-sm px-4 py-2"
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
}


