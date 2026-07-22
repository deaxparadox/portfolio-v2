# Spec 0002: Design Language (Milestone 2)

Status: Awaiting approval
Branch: `feat/design-language` off `main`
Depends on: [ADR-0003](../adrs/0003-design-token-vocabulary.md)

## What's being built

Milestone 2 does not add content or a general-purpose UI kit. It codifies
the visual vocabulary that already emerged from Milestone 1's shipped
shell code — spacing/container, borders, typography, motion, skeletons,
themes, responsive rules — so Milestone 3's first content module inherits
a stable foundation instead of repeating M1's ad-hoc choices. Per your
direction: no generic primitives beyond what the shell itself requires;
the token layer graduates from real duplication, not speculation (see
ADR-0003's audit).

## Concrete changes

### 1. Tokens — `app/globals.css`

Add exactly two color tokens (values match what's already in use, just
named instead of repeated):

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --border: color-mix(in srgb, var(--foreground) 10%, transparent);
  --muted-foreground: color-mix(in srgb, var(--foreground) 60%, transparent);
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-border: var(--border);
  --color-muted-foreground: var(--muted-foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

`--border` and `--muted-foreground` derive from `--foreground` via
`color-mix()` rather than hard-coded `black`/`white`, so they stay
correct automatically in both themes without a separate `.dark`
override — this removes the `black/10 ... dark:white/10` pairing
entirely rather than just renaming it.

No custom radius/duration/easing tokens — Tailwind's own scale already
covers those (see ADR-0003).

### 2. Container primitive — `components/routes/route-container.tsx`

```tsx
export function RouteContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-2xl px-6 py-16">{children}</div>;
}
```

`route-placeholder.tsx`, `route-error.tsx`, and `route-skeleton.tsx` stop
repeating this wrapper and render inside it instead.

**Note:** `max-w-2xl` (672px) is carried forward unchanged from M1 — it
was never a deliberate content-width decision, just what shipped. Flagging
it here rather than silently cementing it: happy to adjust once Milestone
3's real content tells us what width actually fits, since changing one
token then is a one-line edit instead of a find-and-replace.

### 3. Shared pill control — `components/shell/pill-button.tsx`

Extracts the byte-identical button chrome from `navigation.tsx` (companion
toggle) and `route-error.tsx` (retry). Both are shell/shell-adjacent
(chrome + the mandatory error-recovery pattern), not content-module UI, so
this doesn't cross into "general-purpose component library" territory per
ADR-0003's rejection of that.

### 4. Token consumption

Replace across `navigation.tsx`, `companion-workspace.tsx`,
`route-error.tsx`, `route-placeholder.tsx`, `route-skeleton.tsx`:

- `border-black/10 dark:border-white/10` → `border-border`
- `text-foreground/60` → `text-muted-foreground`
- `hover:bg-black/5 dark:hover:bg-white/5` → stays as-is (hover-state
  wash, not a token candidate yet — only one call site after the
  pill-button extraction, so nothing to deduplicate)

### 5. Motion — Companion Workspace open/close

Currently a hard mount/unmount with no transition, deferred from M1's
"no animations beyond what's necessary to validate layout" scope. The
Bible explicitly specifies this one ("Animated resize," 0.3 §7), so it's
in scope now.

Change: stop conditionally unmounting. Keep the panel always in the DOM,
toggle `transition-transform duration-200 ease-out` (mobile/tablet) or
`transition-[width] duration-200 ease-out` (desktop, where translate
wouldn't collapse the flex-item width). When closed: `aria-hidden` and
`inert` on the container (React 19 supports `inert` as a native boolean
prop) so the off-screen panel is neither focusable nor announced —
closes the keyboard-trap gap the current unmount-based approach happens
to avoid only by accident.

### 6. Skeletons — content-shaped, not generic

The Bible (0.3 §17) explicitly prohibits generic pulsing blocks:
"skeletons should resemble final content." Today's `route-skeleton.tsx`
is exactly that violation. Fix: build two atomic shape primitives —

```tsx
function SkeletonLine({ className }: { className?: string }) {
  return <div className={`h-4 rounded bg-foreground/10 ${className ?? ""}`} />;
}
function SkeletonHeading({ className }: { className?: string }) {
  return <div className={`h-8 rounded bg-foreground/10 ${className ?? ""}`} />;
}
```

`route-skeleton.tsx` composes these to match `route-placeholder.tsx`'s
actual shape (a heading line + a description line) — the one real
content shape that exists today. Future modules compose their own
skeletons from the same two primitives against their own real layout,
rather than each inventing a new generic block.

### 7. Responsive rules

No new work — already the single documented source in
[ADR-0002](../adrs/0002-workspace-architecture-and-scroll-strategy.md).
This spec doesn't touch breakpoint logic.

## Explicitly out of scope

- Any Button/Card/Input/Input-group component meant for future content
  modules — Milestone 3 builds those against real requirements.
- Typography scale beyond what's already in use (heading / label /
  muted-body) — nothing today calls for h2–h6 or additional weights.
- A distinct "surface" background token — nothing currently renders at
  a visually distinct elevation from the page background.

## Verification plan

- `pnpm build` / `pnpm lint` clean.
- Visual regression check (Playwright screenshots) at desktop/tablet/
  mobile — shell should look identical to Milestone 1 except the new
  Companion open/close transition and the (invisible) token refactor.
- Keyboard check: Tab through the page with Companion closed — focus
  must skip the off-screen panel entirely (confirms `inert` works).
- Confirm Companion open transition is visually smooth (no layout
  jump) at all three breakpoints.
- Confirm skeleton (`app/loading.tsx` et al.) now renders a
  heading-line + body-line shape instead of two generic rectangles.

## Open items requiring your approval before implementation

1. The `max-w-2xl` container width is carried forward as-is (see §2) —
   flag if you want a different value now rather than at Milestone 3.
2. Everything above — once confirmed, implementation proceeds on
   `feat/design-language`, verified per plan, then `todo.md` and
   `CHANGELOG.md` updated in the closing commit.
