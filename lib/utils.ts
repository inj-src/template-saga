import { clsx, type ClassValue } from "clsx";
import { renderDocument } from "docx-preview";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getHTMLStringFromParsedDoc(
  parsedDoc: Record<string, unknown>
): Promise<string> {
  const container = document.querySelector<HTMLDivElement>("div#temp-container");
  if (!container) throw new Error("Temporary container not found");
  await renderDocument(parsedDoc, container);
  return container.innerHTML;
}
