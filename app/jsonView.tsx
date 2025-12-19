import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
hljs.registerLanguage("json", json);
import "highlight.js/styles/stackoverflow-light.css";


export default function JSONView({ data }: { data: unknown }) {
  const highlightedCode = hljs.highlightAuto(JSON.stringify(data, null, 1)).value;
  return (
    // <div className="px-2 w-full h-full overflow-auto">
    <pre className="rounded-md text-sm">
      <code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
    // </div>
  );
}
