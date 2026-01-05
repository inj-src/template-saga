"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDataStore } from "./store/useDataStore";

export function AddOptionsDialog() {
   const [open, setOpen] = useState(false);
   const [label, setLabel] = useState("");
   const [jsonString, setJsonString] = useState("");
   const [error, setError] = useState<string | null>(null);

   const addCustomDataSet = useDataStore((state) => state.addCustomDataSet);

   const handleSave = () => {
      setError(null);

      if (!label.trim()) {
         setError("Please enter a label for this dataset");
         return;
      }

      if (!jsonString.trim()) {
         setError("Please enter JSON data");
         return;
      }

      try {
         const parsedData = JSON.parse(jsonString);
         addCustomDataSet(label.trim(), parsedData);

         // Reset form and close dialog
         setLabel("");
         setJsonString("");
         setOpen(false);
      } catch {
         setError("Invalid JSON format. Please check your input.");
      }
   };

   const handleOpenChange = (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
         // Reset form when closing
         setLabel("");
         setJsonString("");
         setError(null);
      }
   };

   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>
            <Button
               variant="outline"
               size="icon"
               className="shrink-0"
               title="Add custom JSON data"
            >
               <Plus className="h-4 w-4" />
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>Add Custom JSON Data</DialogTitle>
               <DialogDescription>
                  Paste your JSON string below. It will be saved to localStorage and
                  available in the dropdown.
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid gap-2">
                  <Label htmlFor="label">Label</Label>
                  <Input
                     id="label"
                     placeholder="My Custom Data"
                     value={label}
                     onChange={(e) => setLabel(e.target.value)}
                  />
               </div>
               <div className="grid gap-2">
                  <Label htmlFor="json-data">JSON Data</Label>
                  <Textarea
                     id="json-data"
                     placeholder='{"key": "value", ...}'
                     className="min-h-[200px] font-mono text-sm"
                     value={jsonString}
                     onChange={(e) => setJsonString(e.target.value)}
                  />
               </div>
               {error && (
                  <p className="text-sm text-destructive">{error}</p>
               )}
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
               </Button>
               <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
