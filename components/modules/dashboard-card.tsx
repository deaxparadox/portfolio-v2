import Link from "next/link";

export const dashboardCardClassName =
  "block rounded-lg border border-border p-5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5";

export function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={dashboardCardClassName}
    >
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
