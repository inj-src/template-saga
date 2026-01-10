"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import { Printer, BookOpen, Eye, SquarePen } from "lucide-react";
import { Preview } from "./preview";
import { UploadModal } from "./UploadModal";
import { getHTMLStringFromParsedDoc, printPreview } from "@/lib/utils";
import { SidebarManagerTrigger, useSidebarManager } from "@/components/ui/sidebar";
import Link from "next/link";


interface DocumentPanelProps {
  data: unknown;
  initialTemplateHtml: string | null;
}

type PageSize = "A4" | "Letter" | "Legal" | "A3" | "A5";

export function DocumentPanel({ data, initialTemplateHtml }: DocumentPanelProps) {
  const [htmlString, setHtmlString] = useState<string | null>(initialTemplateHtml);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDocxUpload = async (file: File, pageSize: PageSize) => {
    await parseDocx(file);
    console.log("Page size selected:", pageSize);
  };

  const parseDocx = async (file: File) => {
    try {
      const htmlString = await getHTMLStringFromParsedDoc(file);
      setHtmlString(htmlString);
    } catch (error) {
      console.error("Error parsing docx:", error);
    }
  };
  // const sidebar = useSidebar();
  const manager = useSidebarManager();
  const leftSidebar = manager.use("left");
  const rightSidebar = manager.use("right");

  const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview");

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as "preview" | "edit")}
    >
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="top-0 z-10 sticky flex items-center gap-4 bg-white px-4 py-2 border-gray-300 border-b">
          {!leftSidebar?.open && <SidebarManagerTrigger name="left" />}

          <Input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            className="hidden"
          />

          <UploadModal onDocxUpload={handleDocxUpload} />


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
            {!rightSidebar?.open && <SidebarManagerTrigger name="right" />}
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
