import type { ButtonHTMLAttributes } from "react";

export function PillButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${className ?? ""}`}
      {...props}
    />
  );
}
