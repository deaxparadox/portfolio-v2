import { profile } from "@/lib/content/profile";
import { RouteContainer } from "@/components/routes/route-container";
import { HomeWorkspace } from "@/components/modules/home-workspace";

export default function Home() {
  return (
    <RouteContainer>
      <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{profile.title}</p>
      <p className="mt-4 text-sm text-muted-foreground">{profile.intro}</p>

      <div className="mt-10">
        <HomeWorkspace />
      </div>
    </RouteContainer>
  );
}
