import { profile } from "@/lib/content/profile";
import { featuredProject, projects } from "@/lib/content/projects";
import { RouteContainer } from "@/components/routes/route-container";
import { FeaturedWorkCard } from "@/components/modules/featured-work-card";
import { DashboardCard } from "@/components/modules/dashboard-card";
import { AssistantCard } from "@/components/modules/assistant-card";

export default function Home() {
  return (
    <RouteContainer>
      <h1 className="text-2xl font-semibold tracking-tight">
        {profile.name}
      </h1>
      <p className="mt-1 text-sm font-medium text-muted-foreground">
        {profile.title}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">{profile.intro}</p>

      <div className="mt-10">
        {featuredProject && <FeaturedWorkCard project={featuredProject} />}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DashboardCard
          title="Experience"
          description="Excellence Technologies — Jan 2025–Present. Own production SaaS backends end to end: schema design, auth, background jobs, and the real-time AI systems layered on top."
          href="/experience"
        />
        <DashboardCard
          title="Resume"
          description="ATS and human-friendly versions, kept current."
          href="/resume"
        />
        <DashboardCard
          title="Engineering"
          description="How I think about hard problems: architecture decisions, production debugging, and the trade-offs behind both."
          href="/engineering"
        />
        <DashboardCard
          title="Projects"
          description={`${projects.length} documented projects — voice AI, multi-agent systems, and full-stack SaaS.`}
          href="/projects"
        />
        <DashboardCard
          title="Contact"
          description="Let's talk about what you're building."
          href="/contact"
        />
        <AssistantCard />
      </div>
    </RouteContainer>
  );
}
