import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="flex grid-cols-2 gap-5 pt-12 sm:grid md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-[420px] lg:h-96" />
      ))}
    </div>
  );
}
