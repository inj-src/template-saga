import { registerAllHelpers } from "@/lib/handlebars/helpers";
import { FileText } from "lucide-react";
import Handlebars from "handlebars";

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

  try {
    if (applyData) {
      const template = Handlebars.compile(htmlString || "");
      templateString = template(data);
    } else {
      templateString = htmlString || "";
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
        className="w-max mx-auto space-y-4 my-4 items-center flex-col [&>section]:shadow-xs [&>section]:outline [&>section]:outline-stone-300"
      />
    </div>
  );
}
