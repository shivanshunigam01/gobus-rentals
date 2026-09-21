import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Minimum table width before horizontal scroll kicks in */
  minWidth?: string;
  className?: string;
  hint?: boolean;
};

/** Wraps wide data tables with mobile-friendly horizontal scroll and swipe hint. */
export function ResponsiveTable({ children, minWidth = "640px", className, hint = true }: Props) {
  return (
    <div className={cn("table-scroll-shell", className)}>
      {hint ? (
        <p className="table-scroll-hint" aria-hidden="true">
          Swipe sideways to see all columns
        </p>
      ) : null}
      <div className="table-scroll-inner">
        <div style={{ minWidth }} className="min-w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
