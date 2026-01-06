import { useCallback, useRef, useState } from "react";

interface SandboxResult {
   success: boolean;
   result?: Record<string, unknown>;
   error?: string;
}

export function useSandbox() {
   const workerRef = useRef<Worker | null>(null);
   const [isExecuting, setIsExecuting] = useState(false);
   const [lastError, setLastError] = useState<string | null>(null);

   const executeFunction = useCallback(
      (code: string, data: unknown): Promise<Record<string, unknown>> => {
         return new Promise((resolve, reject) => {
            setIsExecuting(true);
            setLastError(null);

            // Create worker on demand
            if (!workerRef.current) {
               workerRef.current = new Worker(
                  new URL("../workers/sandbox.worker.ts", import.meta.url)
               );
            }

            const worker = workerRef.current;

            const handleMessage = (event: MessageEvent<SandboxResult>) => {
               setIsExecuting(false);
               worker.removeEventListener("message", handleMessage);
               worker.removeEventListener("error", handleError);

               if (event.data.success && event.data.result) {
                  resolve(event.data.result);
               } else {
                  const errorMsg = event.data.error || "Execution failed";
                  setLastError(errorMsg);
                  reject(new Error(errorMsg));
               }
            };

            const handleError = (error: ErrorEvent) => {
               setIsExecuting(false);
               worker.removeEventListener("message", handleMessage);
               worker.removeEventListener("error", handleError);

               const errorMsg = error.message || "Worker error";
               setLastError(errorMsg);
               reject(new Error(errorMsg));
            };

            worker.addEventListener("message", handleMessage);
            worker.addEventListener("error", handleError);

            // Send code and data to worker
            worker.postMessage({ code, data });
         });
      },
      []
   );

   const terminate = useCallback(() => {
      if (workerRef.current) {
         workerRef.current.terminate();
         workerRef.current = null;
      }
   }, []);

   return {
      executeFunction,
      isExecuting,
      lastError,
      terminate,
   };
}
