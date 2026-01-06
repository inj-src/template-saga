import JSONView from "@/app/jsonView";
import { AddOptionsDialog } from "./AddOptionsDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarHeader, SidebarManagerTrigger } from "@/components/ui/sidebar";
import { useDataStore } from "./store/useDataStore";


export function LeftSidebar() {
  const {
    selectedDataKey,
    selectedData,
    setSelectedDataKey,
    getAllDataSets,
  } = useDataStore();

  const dataSets = getAllDataSets();

  return (

    <Sidebar side="left" className="bg-[#f6f5f5] border-r overflow-auto">
      <SidebarHeader>
        <div className="flex justify-between">
          <h2 className="mx-2 font-semibold text-lg">JSON Data</h2>
          <SidebarManagerTrigger name="left" />

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

  )
}

