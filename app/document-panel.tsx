"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import { Printer, BookOpen, Eye, SquarePen } from "lucide-react";
import { Preview } from "./preview";
import { UploadModal } from "./UploadModal";
import { printPreview } from "@/lib/utils";
import { handleDocxUpload } from "@/lib/upload-handlers";
import { SidebarManagerTrigger, useSidebarManager } from "@/components/ui/sidebar";
import Link from "next/link";
import { useDataStore } from "./store/useDataStore";


export function DocumentPanel() {
  const htmlString = useDataStore(state => state.selectedTemplateHtml);
  const data = useDataStore(state => state.selectedData);

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

          <UploadModal
          />


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
        />
      </div>
    </Tabs>
  );
}
