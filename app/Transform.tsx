"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { useSandbox } from "@/hooks/useSandbox";
import { useDataStore } from "./store/useDataStore";
import { Button } from "@/components/ui/button";
import { Play, AlertCircle, CheckCircle2 } from "lucide-react";

const DEFAULT_CODE = `function run(data) {
  return {
    newField: 'hello world'
  };
}`;

export function Transform() {
   const [code, setCode] = useState(DEFAULT_CODE);
   const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
   const { executeFunction, isExecuting, lastError } = useSandbox();
   const { selectedData, setCustomFields } = useDataStore();

   const handleRun = async () => {
      setStatus("idle");
      try {
         const output = await executeFunction(code, selectedData);
         setCustomFields(output);
         setStatus("success");
      } catch {
         setStatus("error");
      }
   };

   return (
      <div className="flex flex-col gap-3">
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
               Custom Fields Function
            </label>
            <p className="text-xs text-gray-500">
               Define a function that receives JSON data and returns an object.
               The returned object will be added to <code>customFields</code>.
            </p>
         </div>

         <CodeEditor
            value={code}
            onChange={setCode}
            className="h-[480px] min-h-[200px]"
         />

         <Button
            onClick={handleRun}
            disabled={isExecuting}
            className="w-full"
            size="sm"
         >
            <Play className="w-4 h-4 mr-2" />
            {isExecuting ? "Running..." : "Run Function"}
         </Button>

         {status === "error" && lastError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
               <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
               <p className="text-sm text-red-700">{lastError}</p>
            </div>
         )}

         {status === "success" && (
            <div className="flex items-center gap-2 text-green-700 p-2 bg-green-50 border border-green-200 rounded-md">
               <CheckCircle2 className="w-4 h-4" />
               <span className="text-sm font-medium">Applied to customFields</span>
            </div>
         )}
      </div>
   );
}
