import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function printPreview() {
  const { default: print } = await import("print-js");
  print({ printable: "preview-container", type: "html", scanStyles: false });
}

export function purifyTemplate(innerHTML: string) {
  let processedHTMLString = removeSpanTagsFromExpressions(innerHTML);
  processedHTMLString = processedHTMLString.replaceAll("”", '"').replaceAll("“", '"');

  return processedHTMLString;
}

function removeSpanTagsFromExpressions(innerHTML: string) {
  const expressions = Array.from(innerHTML.matchAll(/{{2,}([\s\S]*?)}{2,}/gm));

  let indexOffset = 0;
  expressions.forEach((expr) => {
    const fullMatch = expr[0];
    // this parse is there to get rid of span tags covering expressions
    const parser = new DOMParser();
    const text = parser.parseFromString(fullMatch, "text/html").body.textContent || "";
    // performing a splice operation
    innerHTML = replaceStringWithOffset(
      innerHTML,
      fullMatch,
      text,
      expr.index + indexOffset
    );
    indexOffset += text.length - fullMatch.length;
  });
  return innerHTML;
}

function replaceStringWithOffset(
  originalString: string,
  searchString: string,
  replacementString: string,
  offset: number
) {
  // Extract the part of the string *before* the offset
  const prefix = originalString.slice(0, offset);

  // Extract the part of the string *from* the offset onwards
  const suffix = originalString.slice(offset);

  // Perform the replacement on the suffix
  const replacedSuffix = suffix.replace(searchString, replacementString);

  // Combine the prefix and the modified suffix
  return prefix + replacedSuffix;
}

