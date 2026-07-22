import Link from "next/link";
import type { Project } from "@/lib/content/projects";

export function FeaturedWorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.repoUrl ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-border p-8 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Featured Work
      </span>
      <h2 className="mt-2 text-xl font-semibold tracking-tight">
        {project.name}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{project.oneLiner}</p>
    </Link>
  );
}
