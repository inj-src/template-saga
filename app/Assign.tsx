"use client";

export function Assign() {
   return (
      <div className="flex flex-col gap-3">
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
               Assign Fields
            </label>
            <p className="text-xs text-gray-500">
               Assign values to template fields.
            </p>
         </div>

         {/* TODO: Add field assignment UI */}
         <div className="text-sm text-gray-400 italic p-4 border border-dashed rounded-md text-center">
            Field assignment coming soon...
         </div>
      </div>
   );
}
