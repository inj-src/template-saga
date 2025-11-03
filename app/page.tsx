"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import JSONView from "./jsonView";
import { DocumentPanel } from "./document-panel";

export default function Home() {
  return (
    <div className="items-start grid grid-cols-5">
      <div className="top-0 sticky col-span-2">
        <ScrollArea className="h-screen">
          <JSONView />
        </ScrollArea>
      </div>
      <div className="col-span-3">
        <DocumentPanel />
      </div>
    </div>
  );
}
