import { renderDocument } from "docx-preview";
import { useEffect, useRef } from "react";

export function Edit({ parsedDoc }: { parsedDoc: Record<string, unknown> | null }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!parsedDoc || !ref.current) return;
    renderDocument(parsedDoc, ref.current);
  }, [parsedDoc]);

  return <div ref={ref} contentEditable id="edit-container" />;
}
