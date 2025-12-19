"use client";
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
import { allDataSets, DataSetKey } from "./dummy-data";

export default function Home() {
  const { selectedDataKey, selectedData, setSelectedDataKey } = useDataStore();

  return (
    <SidebarProvider defaultOpen={true}>
      {/* <div className="flex w-full"> */}
      <Sidebar side="left" className="bg-[#f6f5f5] border-r overflow-auto">
        <SidebarHeader>
          <div className="flex justify-between">
            <h2 className="mx-2 font-semibold text-lg">JSON Data</h2>
            <SidebarTrigger />
          </div>
          <Select
            value={selectedDataKey}
            onValueChange={(value) => setSelectedDataKey(value as DataSetKey)}
          >
            <SelectTrigger className="bg-background w-full">
              <SelectValue placeholder="Select JSON data" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(allDataSets).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SidebarHeader>
        <SidebarContent>
          <JSONView data={selectedData} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <ScrollArea className="h-screen">
          <DocumentPanel data={selectedData} />
        </ScrollArea>
      </SidebarInset>
      {/* </div> */}
    </SidebarProvider>
  );
}
