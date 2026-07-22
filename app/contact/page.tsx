import { profile } from "@/lib/content/profile";
import { RouteContainer } from "@/components/routes/route-container";

export default function ContactPage() {
  return (
    <RouteContainer>
      <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Let&apos;s talk about what you&apos;re building.
      </p>
      <ul className="mt-6 space-y-3 text-sm">
        <li>
          <a
            href={`mailto:${profile.contact.email}`}
            className="font-medium underline underline-offset-4 hover:text-muted-foreground"
          >
            {profile.contact.email}
          </a>
        </li>
        <li>
          <a
            href={profile.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-muted-foreground"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href={profile.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-muted-foreground"
          >
            GitHub
          </a>
        </li>
      </ul>
    </RouteContainer>
  );
}
