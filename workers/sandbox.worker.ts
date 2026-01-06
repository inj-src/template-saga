// Web Worker for sandboxed function execution
// No access to DOM, window, document, or localStorage

self.onmessage = function (event: MessageEvent<{ code: string; data: unknown }>) {
   const { code, data } = event.data;

   try {
      // Create function from code string
      // The function should be in format: function run(data) { return {...} }
      const fn = new Function("data", `
         "use strict";
         ${code}
         return run(data);
      `);

      const result = fn(data);

      // Validate result is an object
      if (result === null || typeof result !== "object" || Array.isArray(result)) {
         throw new Error("Function must return a plain object");
      }

      self.postMessage({ success: true, result });
   } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      self.postMessage({ success: false, error: message });
   }
};
