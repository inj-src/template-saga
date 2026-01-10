"use client";

import { Sidebar, SidebarContent, SidebarHeader, SidebarManagerTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transform } from "./Transform";
import { Assign } from "./Assign";

export function RightSidebar() {
   return (
      <Sidebar side="right" className="border-r overflow-auto">
         <Tabs defaultValue="assign" className="flex flex-col h-full">
            <SidebarHeader>
               <div className="flex justify-between items-center w-full gap-4">
                  <SidebarManagerTrigger name="right" />
                  <TabsList className="w-full border-input border shadow-xs">
                     <TabsTrigger value="assign">Assign</TabsTrigger>
                     <TabsTrigger value="transform">Transform</TabsTrigger>
                  </TabsList>
               </div>
            </SidebarHeader>
            <SidebarContent className="p-3 flex-1">
               <TabsContent value="assign" className="mt-0">
                  <Assign />
               </TabsContent>
               <TabsContent value="transform" className="mt-0">
                  <Transform />
               </TabsContent>
            </SidebarContent>
         </Tabs>
      </Sidebar>
   );
}
