"use client";

import { ExpressionTree } from "@/components/ExpressionTree";

export function Assign() {

   return (
      <div className="flex flex-col gap-3">
         <label className="text-sm font-medium text-gray-700">
            Template Expressions
         </label>
         <ExpressionTree />
      </div>
   );
}
