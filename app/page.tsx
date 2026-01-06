"use client";
import { useEffect } from "react";
import {
  SidebarInset,
  SidebarManager,
  SidebarManagerProvider,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { DocumentPanel } from "./document-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataStore } from "./store/useDataStore";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";



export default function Page() {
  const {
    selectedData,
    selectedTemplateHtml,
    loadCustomDataSets,
  } = useDataStore();

  useEffect(() => {
    loadCustomDataSets();
  }, [loadCustomDataSets]);


  return (
    <SidebarManagerProvider>
      <SidebarProvider defaultOpen={true}>

        <SidebarManager name="left">
          <LeftSidebar />
        </SidebarManager>

        <SidebarInset>
          <SidebarProvider defaultOpen={true}>

            <SidebarInset>
              <ScrollArea className="h-screen">
                <DocumentPanel data={selectedData} initialTemplateHtml={selectedTemplateHtml} />
              </ScrollArea>
            </SidebarInset>

            <SidebarManager name="right">
              <RightSidebar />
            </SidebarManager>

          </SidebarProvider>
        </SidebarInset>
      </SidebarProvider>
    </SidebarManagerProvider>
  );
}


