import { registerAllHelpers } from "@/lib/handlebars/helpers";
import { FileText } from "lucide-react";
import Handlebars from "handlebars";
import { useDataStore } from "./store/useDataStore";

registerAllHelpers();

type props = {
  data: unknown;
  htmlString: string | null;
  applyData?: boolean;
}

export function Preview({
  data,
  htmlString,
  applyData = true
}: props) {

  let templateString = "";
  const exp = useDataStore((state) => state.highlightedExpression);

  try {
    const template = Handlebars.compile(htmlString || "");
    if (applyData) {
      templateString = template(data);
    } else {
      templateString = htmlString || "";
      if (exp) {
        const before = templateString.slice(0, exp.position);
        const after = templateString.slice(exp.position + exp.raw.length);
        templateString = `${before}<span class="bg-yellow-100 ring-1 ring-yellow-400">${exp.raw}</span>${after}`;
      }
    }
  } catch (error) {
    const err = error as Error;

    templateString = `<div class="p-4 text-red-600">
      <strong>Error:</strong> ${err.message}<br/>
      <div class="mt-2 text-gray-700 text-sm">Hint: check your Handlebars expressions, registered helpers, and the shape of the provided data.</div>
    </div>`;
  }

  return (
    <div>
      {!htmlString && (
        <div className="flex flex-col justify-center items-center gap-4 h-[90dvh]">
          <FileText className="w-24 h-24 text-gray-300 cursor-pointer" />
          <p className="font-medium text-gray-500 text-lg">Upload a document to preview</p>
        </div>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: templateString }}
        id="preview-container"
        className="w-max mx-auto space-y-4 my-4 items-center flex-col shadow-xs outline outline-stone-300"
      />
    </div>
  );
}


