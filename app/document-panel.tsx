"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Upload, Printer, SquarePen, BookOpen } from "lucide-react";
import { Preview } from "./preview";
import { Edit } from "./edit";
import { getHTMLStringFromParsedDoc, printPreview } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

export function DocumentPanel({ data }: { data: unknown }) {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [parsedDoc, setParsedDoc] = useState<Record<string, unknown> | null>(null);
  const [htmlString, setHtmlString] = useState<string | null>(null);
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
      const htmlString = await getHTMLStringFromParsedDoc(file);
      setHtmlString(htmlString);
    } catch (error) {
      console.error("Error parsing docx:", error);
    }
  };
  const sidebar = useSidebar();
  const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview");

  return (
    <Tabs
      defaultValue="preview"
      onValueChange={(value) => setActiveTab(value as "preview" | "edit")}
    >
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="top-0 z-10 sticky flex items-center gap-4 bg-white px-4 py-2 border-gray-300 border-b">
          {!sidebar.open && <SidebarTrigger />}

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
            variant={htmlString ? "secondary" : "default"}
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
              disabled={!htmlString}
            >
              <SquarePen className="w-4 h-4" />
              Edit
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Link href="/docs">
              <Button size={"icon"} variant={"secondary"} title="Help & Documentation">
                <BookOpen />
              </Button>
            </Link>
            <Button
              size={"icon"}
              variant={"secondary"}
              onClick={printPreview}
              disabled={!htmlString || activeTab !== "preview"}
            >
              <Printer />
            </Button>
          </div>
        </div>

        <TabsContent value="preview">
          <Preview
            data={data}
            htmlString={htmlString}
            handleFileUpload={() => fileInputRef.current?.click()}
          />
        </TabsContent>

        <TabsContent value="edit">
          <Edit htmlString={htmlString} setHtmlString={setHtmlString} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
