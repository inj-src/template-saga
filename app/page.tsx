"use client";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import JSONView from "./jsonView";
import { DocumentPanel } from "./document-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataStore } from "./store/useDataStore";
import { AddOptionsDialog } from "./AddOptionsDialog";

export default function Home() {
  const {
    selectedDataKey,
    selectedData,
    selectedTemplateHtml,
    setSelectedDataKey,
    getAllDataSets,
    loadCustomDataSets,
  } = useDataStore();

  useEffect(() => {
    loadCustomDataSets();
  }, [loadCustomDataSets]);

  const dataSets = getAllDataSets();

  return (
    <SidebarProvider defaultOpen={true}>
      {/* <div className="flex w-full"> */}
      <Sidebar side="left" className="bg-[#f6f5f5] border-r overflow-auto">
        <SidebarHeader>
          <div className="flex justify-between">
            <h2 className="mx-2 font-semibold text-lg font-mono">JSON Data</h2>
            <SidebarTrigger />
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedDataKey}
              onValueChange={(value) => setSelectedDataKey(value)}
            >
              <SelectTrigger className="bg-background w-full">
                <SelectValue placeholder="Select JSON data" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(dataSets).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AddOptionsDialog />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <JSONView data={selectedData} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <ScrollArea className="h-screen">
          <DocumentPanel data={selectedData} initialTemplateHtml={selectedTemplateHtml} />
        </ScrollArea>
      </SidebarInset>
      {/* </div> */}
    </SidebarProvider>
  );
}
