import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20": variant === "default",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20": variant === "destructive",
          "text-foreground border border-input hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20": variant === "success",
        },
        className
      )}
      {...props}
    />
  );
}
