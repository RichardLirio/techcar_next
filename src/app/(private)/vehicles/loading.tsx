import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function loadingList() {
  return (
    <div className="flex flex-1 flex-col p-2 gap-4">
      <Skeleton className="h-6 w-[150px] mt-7" />
      <Skeleton className="h-4 w-[180px]" />
      <Skeleton className="h-[400px] w-full max-w- rounded-xl" />
      <div className="space-y-2"></div>
    </div>
  );
}
