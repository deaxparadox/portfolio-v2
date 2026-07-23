import { profile } from "@/lib/content/profile";
import { RouteContainer } from "@/components/routes/route-container";
import { HomeWorkspace } from "@/components/modules/home-workspace";

export default function Home() {
  return (
    <RouteContainer>
      <p className="text-base font-semibold">
        {profile.name}
        <span className="font-normal text-muted-foreground"> · {profile.title}</span>
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{profile.intro}</p>

      <div className="mt-6">
        <HomeWorkspace />
      </div>
    </RouteContainer>
  );
}
