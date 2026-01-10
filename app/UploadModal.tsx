"use client";

import { useState, useRef } from "react";
import { Upload, File, FileArchive, Code } from "lucide-react";
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
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

type PageSize = "A4" | "Letter" | "Legal" | "A3" | "A5";

interface UploadModalProps {
   onDocxUpload: (file: File, pageSize: PageSize) => void;
}

export function UploadModal({ onDocxUpload }: UploadModalProps) {
   const [open, setOpen] = useState(false);
   const [pageSize, setPageSize] = useState<PageSize>("A4");
   const [rawHtml, setRawHtml] = useState("");
   const docxInputRef = useRef<HTMLInputElement>(null);
   const zipInputRef = useRef<HTMLInputElement>(null);

   const handleDocxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const docxExt = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const file = e.target.files?.[0];
      if (file && file.type === docxExt) {
         onDocxUpload(file, pageSize);
         setOpen(false);
         // Reset the input
         if (docxInputRef.current) {
            docxInputRef.current.value = "";
         }
      } else if (file) {
         alert("Please select a valid .docx file");
      }
   };

   const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // TODO: Implement zip upload logic
      const file = e.target.files?.[0];
      if (file) {
         console.log("Zip upload not implemented yet", file);
      }
   };

   const handleRawHtmlUpload = () => {
      // TODO: Implement raw HTML upload logic
      console.log("Raw HTML upload not implemented yet", rawHtml);
   };

   const handleOpenChange = (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
         // Reset form when closing
         setRawHtml("");
         setPageSize("A4");
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
                  <Select
                     value={pageSize}
                     onValueChange={(value) => setPageSize(value as PageSize)}
                  >
                     <SelectTrigger id="page-size">
                        <SelectValue placeholder="Select page size" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="A4">A4 (210 x 297 mm)</SelectItem>
                        <SelectItem value="Letter">Letter (8.5 x 11 in)</SelectItem>
                        <SelectItem value="Legal">Legal (8.5 x 14 in)</SelectItem>
                        <SelectItem value="A3">A3 (297 x 420 mm)</SelectItem>
                        <SelectItem value="A5">A5 (148 x 210 mm)</SelectItem>
                     </SelectContent>
                  </Select>
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
                        <FileArchive className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                           Upload a .zip file containing documents
                        </p>
                        <Button
                           onClick={() => zipInputRef.current?.click()}
                           variant="outline"
                        >
                           Select ZIP File
                        </Button>
                        <input
                           ref={zipInputRef}
                           type="file"
                           accept=".zip"
                           onChange={handleZipChange}
                           className="hidden"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                           ZIP upload coming soon...
                        </p>
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
                        />
                        <p className="text-xs text-muted-foreground">
                           Paste your HTML code directly
                        </p>
                     </div>
                     <div className="flex justify-end">
                        <Button onClick={handleRawHtmlUpload} disabled={!rawHtml.trim()}>
                           Upload HTML
                        </Button>
                     </div>
                     <p className="text-xs text-muted-foreground text-center">
                        HTML upload coming soon...
                     </p>
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
