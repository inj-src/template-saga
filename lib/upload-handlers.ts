import { renderAsync } from "@inj-src/docx-preview";
import JSZip from "jszip";
import { purifyTemplate } from "./utils";

/**
 * Result interface for upload handlers
 */
export interface UploadResult {
   html: string;
   images: Record<string, string>; // Map of filename to base64 data URL
}

/**
 * Handles DOCX file upload by parsing the file using docx-preview.
 * The DOCX is converted to HTML with embedded base64 images.
 *
 * @param file - The DOCX file to process
 * @returns Promise<UploadResult> containing the HTML string and empty images (images are embedded in HTML)
 */
export async function handleDocxUpload(file: File): Promise<UploadResult> {
   const container = document.createElement("div");
   await renderAsync(file, container, undefined, { inWrapper: false, useBase64URL: true });
   const html = purifyTemplate(container.innerHTML);

   return {
      html,
      images: {}, // Images are embedded as base64 in the HTML by docx-preview
   };
}

/**
 * Handles ZIP file upload containing an HTML file and PNG images.
 * The ZIP structure should be:
 * - *.html (one HTML file at root)
 * - images/*.png (PNG files in images folder)
 *
 * Images are serialized to base64 data URLs and can be referenced in the HTML.
 * The output HTML contains only the style tags and body content.
 *
 * @param file - The ZIP file to process
 * @returns Promise<UploadResult> containing the HTML string and serialized images
 */
export async function handleZipUpload(file: File): Promise<UploadResult> {
   const zip = await JSZip.loadAsync(file);

   let htmlContent = "";
   const images: Record<string, string> = {};

   // Find and process the HTML file
   const htmlFiles = Object.keys(zip.files).filter((name) =>
      name.endsWith(".html")
   );

   if (htmlFiles.length === 0) {
      throw new Error("No HTML file found in the ZIP archive");
   }

   if (htmlFiles.length > 1) {
      console.warn("Multiple HTML files found, using the first one:", htmlFiles[0]);
   }

   // Read the HTML content
   const htmlFile = zip.file(htmlFiles[0]);
   if (htmlFile) {
      htmlContent = await htmlFile.async("string");
   }

   // Find and process all PNG files in the images folder
   const imageFiles = Object.keys(zip.files).filter(
      (name) =>
         name.startsWith("images/") &&
         name.toLowerCase().endsWith(".png") &&
         !zip.files[name].dir
   );

   // Process each image file
   for (const imagePath of imageFiles) {
      const imageFile = zip.file(imagePath);
      if (imageFile) {
         const base64Data = await imageFile.async("base64");
         // Extract just the filename (e.g., "images/logo.png" -> "logo.png")
         const filename = imagePath.split("/").pop() || imagePath;
         const dataUrl = `data:image/png;base64,${base64Data}`;
         images[filename] = dataUrl;
      }
   }

   // Replace image references in HTML with base64 data URLs
   let processedHtml = htmlContent;
   for (const [filename, dataUrl] of Object.entries(images)) {
      // Replace various forms of image references
      // e.g., src="images/logo.png", src="./images/logo.png", src="logo.png"
      const patterns = [
         new RegExp(`src=["']images/${filename}["']`, "g"),
         new RegExp(`src=["']\\./images/${filename}["']`, "g"),
         new RegExp(`src=["']${filename}["']`, "g"),
      ];

      for (const pattern of patterns) {
         processedHtml = processedHtml.replace(pattern, `src="${dataUrl}"`);
      }
   }

   // Parse HTML and extract only style tags and body content
   const parser = new DOMParser();
   const doc = parser.parseFromString(processedHtml, "text/html");

   // Get all style tags from head and body
   const styleTags = doc.querySelectorAll("style");
   const styleContent = Array.from(styleTags).map((tag) => tag.outerHTML).join("\n");

   // Get body content and wrap with a div that has the body's class
   const body = doc.querySelector("body");
   const bodyClass = body?.className || "";
   const bodyContent = body ? body.innerHTML : processedHtml;

   // Wrap body content in a div with the body's class
   const wrappedContent = bodyClass
      ? `<div class="${bodyClass}">${bodyContent}</div>`
      : bodyContent;

   // Combine: [style tags] + [wrapped body content]
   const finalHtml = styleContent + "\n" + wrappedContent;
   const html = purifyTemplate(finalHtml);

   return {
      html: html.trim(),
      images,
   };
}

/**
 * Handles raw HTML string upload.
 * The HTML is taken as-is without any processing.
 *
 * @param htmlString - The raw HTML string to use as template
 * @returns Promise<UploadResult> containing the HTML string and empty images
 */
export async function handleRawHtmlUpload(htmlString: string): Promise<UploadResult> {
   if (!htmlString.trim()) {
      throw new Error("HTML string cannot be empty");
   }
   const html = purifyTemplate(htmlString);

   return {
      html: html.trim(),
      images: {},
   };
}
