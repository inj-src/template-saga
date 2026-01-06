"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import { Upload, Printer, BookOpen, Eye, SquarePen } from "lucide-react";
import { Preview } from "./preview";
// import { Edit } from "./edit";
import { getHTMLStringFromParsedDoc, printPreview } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

interface DocumentPanelProps {
  data: unknown;
  initialTemplateHtml: string | null;
}

export function DocumentPanel({ data, initialTemplateHtml }: DocumentPanelProps) {
  const [htmlString, setHtmlString] = useState<string | null>(initialTemplateHtml);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with initialTemplateHtml when a dataset with template is selected
  useEffect(() => {
    setHtmlString(initialTemplateHtml);
  }, [initialTemplateHtml]);

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
      value={activeTab}
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
            onClick={() => {
              if (activeTab === "edit") {
                setActiveTab('preview')
              }
              fileInputRef.current?.click()
            }}
            variant={htmlString ? "secondary" : "default"}
            title={"Upload Document"}
          >
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
              title="Print Preview"
              variant={"secondary"}
              onClick={() => {
                if (activeTab === "edit") {
                  setActiveTab('preview')
                  setTimeout(printPreview, 100)
                } else {
                  printPreview()
                }
              }}
              disabled={!htmlString}
            >
              <Printer />
            </Button>
          </div>
        </div>

          <Preview
            data={data}
          applyData={activeTab == 'preview'}
            htmlString={htmlString}
            handleFileUpload={() => fileInputRef.current?.click()}
        />
      </div>
    </Tabs>
  );
}
