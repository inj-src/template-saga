import { Previewer } from "pagedjs";
import { useEffect, useState } from "react";

export function usePaginate(htmlString: string, paperSize: string = "A4") {
   const [pages, setPages] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      paginate(htmlString, paperSize)
         .then((pages) => {
            setPages(pages);
         })
         .catch((error) => {
            setError(error.message);
         })
         .finally(() => {
            setLoading(false);
         });
   }, [htmlString, paperSize]);

   return { pages, loading, error };
}


async function paginate(htmlString: string, paperSize: string = "A4") {
   const dom = new DOMParser().parseFromString(htmlString, "text/html");

   const template = document.createElement('div');
   template.append(...dom.head.children);
   template.append(...dom.body.children);

   document.body.appendChild(template);

   let returnString = '';

   // include style tags
   template.querySelectorAll('style').forEach((style) => {
      returnString += style.outerHTML;
   });

   // include sections
   const sections = template.querySelectorAll<HTMLElement>("& > section")

   for (const section of sections) {

      const { paddingTop, paddingBottom, paddingRight, paddingLeft } = getComputedStyle(section);

      const margins = {
         top: parseFloat(paddingTop),
         bottom: parseFloat(paddingBottom),
         right: parseFloat(paddingRight),
         left: parseFloat(paddingLeft),
      };

      section.removeAttribute('style');

      const header = section.querySelector('header');
      const footer = section.querySelector('footer');

      if (header) {
         const { marginTop, marginBottom, height } = getComputedStyle(header);
         const marginTopNum = parseFloat(marginTop);
         const marginBottomNum = parseFloat(marginBottom);
         const heightNum = parseFloat(height);

         let topHeight = heightNum;

         if (marginTopNum > 0) {
            topHeight += marginTopNum;
         }
         if (marginBottomNum > 0) {
            topHeight += marginBottomNum;
         }

         margins.top = Math.max(margins.top, topHeight);
         // header.removeAttribute('style');
         // header.style.height = `${topHeight}px`;
      }

      if (footer) {
         const { marginTop, marginBottom, height } = getComputedStyle(footer);
         const marginTopNum = parseFloat(marginTop);
         const marginBottomNum = parseFloat(marginBottom);
         const heightNum = parseFloat(height);

         let bottomHeight = heightNum;

         if (marginTopNum > 0) {
            bottomHeight += marginTopNum;
         }
         if (marginBottomNum > 0) {
            bottomHeight += marginBottomNum;
         }

         margins.bottom = Math.max(margins.bottom, bottomHeight);
         // footer.removeAttribute('style');
         // footer.style.height = `${bottomHeight}px`;
      }  

      const container = document.createElement('div');
      container.style.visibility = 'hidden';
      document.body.appendChild(container);

      const pageStyle = `@page {size: A4; margin: ${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px;}`

      //# for some reason pagedjs accepts this content format: header -> footer -> content
      if (footer) section.prepend(footer)
      if (header) section.prepend(header)


      const previewer = new Previewer();
      const result = await previewer.preview(section, ['/paged.css', { pageStyle }], container);
      console.log({ result })

      returnString += container.innerHTML;
      container.remove();
   }

   template.remove();
   return returnString;
}

