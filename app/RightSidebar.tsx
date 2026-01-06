"use client";

import { useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarManagerTrigger } from "@/components/ui/sidebar";
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

export function RightSidebar() {
   const [code, setCode] = useState(DEFAULT_CODE);
   const [result, setResult] = useState<Record<string, unknown> | null>(null);
   const { executeFunction, isExecuting, lastError } = useSandbox();
   const { selectedData, setCustomFields } = useDataStore();

   const handleRun = async () => {
      setResult(null);
      try {
         const output = await executeFunction(code, selectedData);
         setResult(output);
         setCustomFields(output);
      } catch {
         // Error is already captured in lastError
      }
   };

   return (
      <Sidebar side="right" className="bg-[#f6f5f5] border-r overflow-auto">
         <SidebarHeader>
            <div className="flex justify-between items-center">
               <h2 className="mx-2 font-semibold text-lg">Transform</h2>
               <SidebarManagerTrigger name="right" />
            </div>
         </SidebarHeader>
         <SidebarContent className="p-3 flex flex-col gap-3">
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
               className="h-[280px] min-h-[200px]"
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

            {lastError && (
               <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{lastError}</p>
               </div>
            )}

            {result && !lastError && (
               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-green-700">
                     <CheckCircle2 className="w-4 h-4" />
                     <span className="text-sm font-medium">Success</span>
                  </div>
                  <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-auto max-h-[200px]">
                     {JSON.stringify(result, null, 2)}
                  </pre>
               </div>
            )}
         </SidebarContent>
      </Sidebar>
   );
}
