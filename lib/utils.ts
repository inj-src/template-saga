import { clsx, type ClassValue } from "clsx";
import { renderAsync } from "@inj-src/docx-preview";
import parse from "node-html-parser";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getHTMLStringFromParsedDoc(file: File): Promise<string> {
  const container = document.createElement("div");
  let styleContainer: HTMLDivElement | null = document.querySelector("#style_container");
  if (!styleContainer) {
    styleContainer = document.createElement("div");
    styleContainer.id = "style_container";
    document.body.appendChild(styleContainer);
  }

  await renderAsync(file, container, styleContainer, { inWrapper: false });
  return container.innerHTML;
}

export async function printPreview() {
  const { default: print } = await import("print-js");
  const styleContainer: HTMLDivElement | null = document.querySelector("#style_container");

  print({ printable: "preview-container", type: "html", scanStyles: false, style: styleContainer?.innerHTML });
}

export function processTemplateExpressions(innerHTML: string) {
  const expressions = Array.from(innerHTML.matchAll(/{{2,}([\s\S]*?)}{2,}/gm));

  let indexOffset = 0;
  expressions.forEach((expr) => {
    const fullMatch = expr[0];
    const text = parse(fullMatch).textContent;
    const replacedText = text.replaceAll("”", '"').replaceAll("“", '"');
    // performing a splice operation
    innerHTML = replaceStringWithOffset(
      innerHTML,
      fullMatch,
      replacedText,
      expr.index + indexOffset
    );
    indexOffset += replacedText.length - fullMatch.length;
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
