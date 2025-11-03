"use client";

import { useRef, useState } from "react";
import { parseAsync } from "docx-preview";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Upload, Printer, SquarePen } from "lucide-react";
import { Preview } from "./preview";
import { Edit } from "./edit";

export function DocumentPanel() {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedDoc, setParsedDoc] = useState<Record<string, unknown> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const docxExt = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const file = e.target.files?.[0];
    if (file && file.type === docxExt) {
      // setSelectedFile(file);
      await parseDocx(file);
    } else if (file) {
      alert("Please select a valid .docx file");
    }
  };

  const parseDocx = async (file: File) => {
    try {
      // Parse the docx file using parseAsync
      const parsedDoc = await parseAsync(file);
      console.log(parsedDoc);
      setParsedDoc(parsedDoc);
      // const htmlString = await getHTMLStringFromParsedDoc(parsedDoc);
    } catch (error) {
      console.error("Error parsing docx:", error);
    }
  };

  return (
    <Tabs defaultValue="preview">
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="top-0 z-10 sticky flex items-center gap-4 bg-white px-4 py-2 border-gray-300 border-b">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            size={"icon"}
            onClick={() => fileInputRef.current?.click()}
            variant={parsedDoc ? "secondary" : "default"}
          >
            {/* Upload Document */}
            <Upload />
          </Button>

          <TabsList className="mx-auto">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className="flex items-center gap-2 w-36"
              disabled={!parsedDoc}
            >
              <SquarePen className="w-4 h-4" />
              Edit
            </TabsTrigger>
          </TabsList>
          <Button size={"icon"} variant={"secondary"}>
            <Printer />
          </Button>
        </div>

        <TabsContent value="preview">
          <Preview parsedDoc={parsedDoc} handleFileUpload={() => fileInputRef.current?.click()} />
        </TabsContent>

        <TabsContent value="edit">
          <Edit parsedDoc={parsedDoc} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
