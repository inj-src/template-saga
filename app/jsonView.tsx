"use client";

import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
hljs.registerLanguage("json", json);
import "highlight.js/styles/stackoverflow-light.css";
import { useDataStore } from "./store/useDataStore";

export default function JSONView({ data }: { data: unknown }) {
  const { customFields } = useDataStore();

  // Merge customFields into data if data is an object
  const mergedData =
    data && typeof data === "object" && !Array.isArray(data)
      ? { ...data, customFields }
      : data;

  const highlightedCode = hljs.highlightAuto(JSON.stringify(mergedData, null, 1)).value;
  return (
    <pre className="rounded-md text-sm">
      <code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
}

