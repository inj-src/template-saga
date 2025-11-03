import { renderDocument } from "docx-preview";
import { FileText } from "lucide-react";
import { useEffect, useRef } from "react";
// import { useEffect, useRef } from "react";

export function Preview({
  parsedDoc,
  handleFileUpload,
}: {
  parsedDoc: Record<string, unknown> | null;
  handleFileUpload: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !parsedDoc) return;
    renderDocument(parsedDoc, ref.current);
  }, [parsedDoc]);

  return (
    <div>
      {!parsedDoc && (
        <div
          className="flex flex-col justify-center items-center gap-4 h-screen cursor-pointer"
          onClick={handleFileUpload}
        >
          <FileText className="w-24 h-24 text-gray-300" />
          <p className="font-medium text-gray-500 text-lg">Upload a document to preview</p>
        </div>
      )}
      <div ref={ref} id="preview-container" />
    </div>
  );
}
