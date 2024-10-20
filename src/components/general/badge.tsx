import { cn } from "@/lib/utils";
import React from "react";

interface IBadgeProps {
  children: React.ReactNode;
  className?: string;
}

function Badge({ children, className }: IBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-xs w-fit bg-primary px-2 py-1 text-xs text-primary-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
