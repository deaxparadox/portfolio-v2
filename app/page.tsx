import { profile } from "@/lib/content/profile";
import { RouteContainer } from "@/components/routes/route-container";
import { DashboardCard } from "@/components/modules/dashboard-card";

export default function Home() {
  return (
    <RouteContainer>
      <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{profile.title}</p>
      <p className="mt-4 text-sm text-muted-foreground">{profile.intro}</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DashboardCard
          title="Can he solve difficult problems?"
          description="Nine bugs were reported in a production voice AI, days before a client demo. There was only one root cause."
          href="/projects/vocalyst"
        />
        <DashboardCard
          title="Can I trust his technical decisions?"
          description="No backend API server. The browser talks to the database directly. The security model has to survive someone skipping the UI entirely."
          href="/projects/buildconnect-usa"
        />
        <DashboardCard
          title="What has he actually built?"
          description="A solo-built AI career platform — ~36,000 lines, two independently-tuned voice agents — honestly scoped: the employer module is still mid-development."
          href="/projects/hireiq"
        />
        <DashboardCard
          title="How does he think?"
          description="The model never touches the numbers. It only explains them."
          href="/projects/sellerpulse"
        />
      </div>
    </RouteContainer>
  );
}
