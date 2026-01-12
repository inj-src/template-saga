"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import { Printer, BookOpen, Eye, SquarePen } from "lucide-react";
import { Preview } from "./preview";
import { UploadModal } from "./UploadModal";
import { printPreview } from "@/lib/utils";
import Link from "next/link";
import { useDataStore } from "./store/useDataStore";
import { SidebarManagerTrigger, useSidebarManager } from "@/components/ui/sidebar";


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
      <div
        className="h-dvh flex flex-col"
      >

        <div className="top-0 z-10 sticky flex items-center gap-4 bg-white px-4 py-2 border-gray-300 border-b">
          {(leftSidebar?.isMobile || !leftSidebar?.open) && <SidebarManagerTrigger name="left" />}
          <UploadModal />

          <TabsList className="mx-auto w-full max-w-[250px]">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden lg:inline">
                Preview
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className="flex items-center gap-2"
              disabled={!htmlString}
            >
              <SquarePen className="w-4 h-4" />
              <span className="hidden lg:inline">
                Edit
              </span>
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
            {(rightSidebar?.isMobile || !rightSidebar?.open) && <SidebarManagerTrigger name="right" />}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 ">
          <Preview
            data={data}
            applyData={activeTab == 'preview'}
            htmlString={htmlString}
          />
        </div>
      </div>

    </Tabs>
  );
}
