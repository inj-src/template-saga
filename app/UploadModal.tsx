"use client";

import { useState, useRef } from "react";
import { Upload, File, FileArchive, Code, Loader2, AlertCircle } from "lucide-react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
   handleZipUpload as processZip,
   handleRawHtmlUpload as processRawHtml,
   handleDocxUpload,
} from "@/lib/upload-handlers";
import { useDataStore } from "./store/useDataStore";


export function UploadModal() {
   const [open, setOpen] = useState(false);
   const [rawHtml, setRawHtml] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const docxInputRef = useRef<HTMLInputElement>(null);
   const zipInputRef = useRef<HTMLInputElement>(null);
   const setHTMLString = useDataStore(state => state.setSelectedTemplateHtml);

   const handleDocxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const docxExt = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const file = e.target.files?.[0];
      if (file && file.type === docxExt) {
         const result = await handleDocxUpload(file);
         setHTMLString(result.html);
         setOpen(false);
         // Reset the input
         if (docxInputRef.current) {
            docxInputRef.current.value = "";
         }
      } else if (file) {
         setError("Please select a valid .docx file");
      }
   };

   const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".zip")) {
         setError("Please select a valid .zip file");
         return;
      }

      setIsLoading(true);
      setError(null);

      try {
         const result = await processZip(file);
         setHTMLString(result.html);
         setOpen(false);
      } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to process ZIP file");
      } finally {
         setIsLoading(false);
         if (zipInputRef.current) {
            zipInputRef.current.value = "";
         }
      }
   };

   const handleRawHtmlSubmit = async () => {
      if (!rawHtml.trim()) {
         setError("HTML content cannot be empty");
         return;
      }

      setIsLoading(true);
      setError(null);

      try {
         const result = await processRawHtml(rawHtml);
         setHTMLString(result.html);
         setOpen(false);
      } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to process HTML");
      } finally {
         setIsLoading(false);
      }
   };

   const handleOpenChange = (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
         // Reset form when closing
         setRawHtml("");
         setError(null);
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>
            <Button
               size={"icon"}
               variant="default"
               title={"Upload Document"}
            >
               <Upload />
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
               <DialogTitle>Upload Document</DialogTitle>
               <DialogDescription>
                  Choose a document upload method to get started.
               </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
               {/* Page Size Selector */}
               <div className="grid gap-2">
                  <Label htmlFor="page-size">Page Size</Label>

               </div>

               {/* Upload Type Tabs */}
               <Tabs defaultValue="docx" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                     <TabsTrigger value="docx" className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        DOCX
                     </TabsTrigger>
                     <TabsTrigger value="zip" className="flex items-center gap-2">
                        <FileArchive className="w-4 h-4" />
                        ZIP
                     </TabsTrigger>
                     <TabsTrigger value="html" className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        HTML
                     </TabsTrigger>
                  </TabsList>

                  <TabsContent value="docx" className="space-y-4 mt-4">
                     <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
                        <File className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                           Upload a .docx file to convert to HTML
                        </p>
                        <Button
                           onClick={() => docxInputRef.current?.click()}
                           variant="outline"
                        >
                           Select DOCX File
                        </Button>
                        <input
                           ref={docxInputRef}
                           type="file"
                           accept=".docx"
                           onChange={handleDocxChange}
                           className="hidden"
                        />
                     </div>
                  </TabsContent>

                  <TabsContent value="zip" className="space-y-4 mt-4">
                     <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
                        {isLoading ? (
                           <Loader2 className="w-12 h-12 text-muted-foreground mb-4 animate-spin" />
                        ) : (
                              <FileArchive className="w-12 h-12 text-muted-foreground mb-4" />
                        )}
                        <p className="text-sm text-muted-foreground mb-2">
                           Upload a .zip file containing HTML and images
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                           ZIP should contain: *.html file + images/*.png files
                        </p>
                        <Button
                           onClick={() => zipInputRef.current?.click()}
                           variant="outline"
                           disabled={isLoading}
                        >
                           {isLoading ? "Processing..." : "Select ZIP File"}
                        </Button>
                        <input
                           ref={zipInputRef}
                           type="file"
                           accept=".zip"
                           onChange={handleZipChange}
                           className="hidden"
                        />
                        {error && (
                           <div className="flex items-center gap-2 text-destructive mt-2">
                              <AlertCircle className="w-4 h-4" />
                              <p className="text-sm">{error}</p>
                           </div>
                        )}
                     </div>
                  </TabsContent>

                  <TabsContent value="html" className="space-y-4 mt-4">
                     <div className="space-y-2">
                        <Label htmlFor="raw-html">Raw HTML</Label>
                        <Textarea
                           id="raw-html"
                           placeholder="<html>...</html>"
                           className="min-h-[200px] font-mono text-sm"
                           value={rawHtml}
                           onChange={(e) => setRawHtml(e.target.value)}
                           disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                           Paste your HTML code directly
                        </p>
                     </div>
                     {error && (
                        <div className="flex items-center gap-2 text-destructive">
                           <AlertCircle className="w-4 h-4" />
                           <p className="text-sm">{error}</p>
                        </div>
                     )}
                     <div className="flex justify-end">
                        <Button onClick={handleRawHtmlSubmit} disabled={!rawHtml.trim() || isLoading}>
                           {isLoading ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                           ) : (
                              "Upload HTML"
                           )}
                        </Button>
                     </div>
                  </TabsContent>
               </Tabs>
            </div>

            <DialogFooter>
               <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
