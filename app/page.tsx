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
    loadCustomDataSets,
  } = useDataStore();

  useEffect(() => {
    loadCustomDataSets();
  }, [loadCustomDataSets]);


  return (
    <div className="max-w-screen overflow-x-hidden">
      <SidebarManagerProvider>
        <SidebarProvider defaultOpen={true}>

          <SidebarManager name="left">
            <LeftSidebar />
          </SidebarManager>
          <SidebarInset className="min-w-0 ">

            <SidebarProvider defaultOpen={true}>
              <SidebarInset className="min-w-0">
                <DocumentPanel />
              </SidebarInset>

              <SidebarManager name="right">
                <RightSidebar />
              </SidebarManager>
            </SidebarProvider>

          </SidebarInset>
        </SidebarProvider>
      </SidebarManagerProvider>
    </div>
  );
}


