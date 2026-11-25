import { useId } from "react";

import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  const gradientId = `brand-${useId().replace(/:/g, "")}`;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/20",
        "shadow-[0_12px_26px_-14px_var(--primary)]",
        className,
      )}
      style={{
        backgroundImage: "linear-gradient(135deg, var(--primary), var(--violet) 55%, var(--ai))",
      }}
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 32 32">
        <defs>
          <linearGradient id={gradientId} x1="6" x2="27" y1="6" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.95" />
            <stop offset="1" stopColor="white" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <g stroke={`url(#${gradientId})`} strokeLinecap="round" strokeWidth="1.2">
          <path d="M7 9 16 13M7 16 16 16M7 23 16 19M16 13 25 16M16 16 25 16M16 19 25 16" />
        </g>
        <g fill="white">
          <circle cx="7" cy="9" r="1.7" />
          <circle cx="7" cy="16" r="1.7" />
          <circle cx="7" cy="23" r="1.7" />
          <circle cx="16" cy="13" r="1.7" />
          <circle cx="16" cy="16" r="1.7" />
          <circle cx="16" cy="19" r="1.7" />
          <circle cx="25" cy="16" r="2.3" />
        </g>
      </svg>
    </span>
  );
}
