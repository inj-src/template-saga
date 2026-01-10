"use client";

import { ExpressionTree } from "@/components/ExpressionTree";
import { useDataStore } from "./store/useDataStore";

export function Assign() {
   const selectedTemplateHtml = useDataStore((state) => state.selectedTemplateHtml);

   return (
      <div className="flex flex-col gap-3">
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
               Template Expressions
            </label>
            <p className="text-xs text-gray-500">
               All handlebars expressions found in the template.
            </p>
         </div>

         <ExpressionTree htmlString={selectedTemplateHtml} />
      </div>
   );
}
