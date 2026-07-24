"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CaseFile } from "@/lib/content/types";
import { CaseFileBadges } from "@/components/modules/case-file-badges";

// Validated as a real interactive artifact first (docs/specs/0009-project-
// drum-infinite-rotation.md) — every item always exists on a full circle
// (infinite rotation, no clamped ends), the angle between adjacent items is
// 360/N (derived from the dataset, not hardcoded), and radius is the exact
// chord-length formula for near-tangent spacing at any N, not a tuned
// constant valid only at today's count.
const HEIGHT_RATIO = 340 / 260; // card aspect ratio, unrelated to N
const PERSPECTIVE_TO_RADIUS_RATIO = 2.5; // tuned by eye against the artifact

const CARD_WIDTH_FRACTION = 0.34; // fraction of the stage's measured width
const MIN_CARD_WIDTH = 220;
const MAX_CARD_WIDTH = 420;

const WHEEL_THRESHOLD = 40;
const SWIPE_THRESHOLD = 50;

function shortestDelta(from: number, to: number, n: number) {
  let raw = (to - from) % n;
  if (raw > n / 2) raw -= n;
  if (raw <= -n / 2) raw += n;
  return raw;
}

export function CaseFileBrowser({ caseFiles }: { caseFiles: CaseFile[] }) {
  const N = caseFiles.length;
  const anglePerCard = 360 / N;

  const [activeIndex, setActiveIndex] = useState(0);
  // Each card's own continuously-accumulating rotation — never wrapped back
  // into -180..180. A naive re-derivation of each card's angle fresh every
  // render is guaranteed to glitch: the card exactly opposite Focus flips
  // sign once per full rotation (e.g. +180 -> -150), and a CSS transition
  // animating that raw number sweeps the long way around instead of the
  // short way. Accumulating means every step is always a small, correctly-
  // directioned change.
  const [rotationOffsets, setRotationOffsets] = useState<number[]>(() =>
    caseFiles.map((_, i) => shortestDelta(0, i, N) * anglePerCard),
  );
  const [cardWidth, setCardWidth] = useState(260);

  const stageRef = useRef<HTMLDivElement>(null);
  const wheelAccum = useRef(0);
  const wheelLocked = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchDelta = useRef(0);

  function rotateBy(delta: number) {
    if (delta === 0) return;
    setRotationOffsets((prev) => prev.map((v) => v - delta * anglePerCard));
    setActiveIndex((prev) => ((prev + delta) % N + N) % N);
  }

  function goTo(index: number) {
    rotateBy(shortestDelta(activeIndex, index, N));
  }

  function prefersReducedMotion() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  // Single source of truth for geometry: the stage's real rendered width
  // drives card size (and everything derived from it below), instead of a
  // fixed pixel constant tuned against one viewport.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const next = Math.max(
        MIN_CARD_WIDTH,
        Math.min(MAX_CARD_WIDTH, width * CARD_WIDTH_FRACTION),
      );
      setCardWidth(next);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const cardHeight = cardWidth * HEIGHT_RATIO;
  // Exact chord-length formula for near-tangent spacing at any N, rather
  // than a ratio only valid at today's count.
  const radius = cardWidth / (2 * Math.sin(Math.PI / N));
  const perspective = radius * PERSPECTIVE_TO_RADIUS_RATIO;

  // React attaches onWheel/onTouchMove as passive listeners by default, so
  // e.preventDefault() inside a synthetic handler silently fails instead of
  // stopping the page from scrolling underneath the drum. A native,
  // explicitly non-passive listener is the only way to actually block it.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      if (wheelLocked.current) return;
      wheelAccum.current += e.deltaY;
      if (Math.abs(wheelAccum.current) >= WHEEL_THRESHOLD) {
        rotateBy(wheelAccum.current > 0 ? 1 : -1);
        wheelAccum.current = 0;
        wheelLocked.current = true;
        setTimeout(
          () => {
            wheelLocked.current = false;
          },
          prefersReducedMotion() ? 0 : 260,
        );
      }
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX;
      touchDelta.current = 0;
    }

    function handleTouchMove(e: TouchEvent) {
      if (touchStartX.current === null) return;
      e.preventDefault();
      touchDelta.current = e.touches[0].clientX - touchStartX.current;
    }

    function handleTouchEnd() {
      if (Math.abs(touchDelta.current) >= SWIPE_THRESHOLD) {
        rotateBy(touchDelta.current < 0 ? 1 : -1);
      }
      touchStartX.current = null;
      touchDelta.current = 0;
    }

    stage.addEventListener("wheel", handleWheel, { passive: false });
    stage.addEventListener("touchstart", handleTouchStart, { passive: true });
    stage.addEventListener("touchmove", handleTouchMove, { passive: false });
    stage.addEventListener("touchend", handleTouchEnd);

    return () => {
      stage.removeEventListener("wheel", handleWheel);
      stage.removeEventListener("touchstart", handleTouchStart);
      stage.removeEventListener("touchmove", handleTouchMove);
      stage.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      rotateBy(1);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      rotateBy(-1);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <span className="text-xs tabular-nums text-muted-foreground">
          {String(activeIndex + 1).padStart(2, "0")} / {N}
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <nav
          aria-label="Project index"
          className="flex w-14 flex-shrink-0 flex-col items-center border-r border-border py-4"
        >
          <button
            type="button"
            onClick={() => rotateBy(-1)}
            aria-label="Rotate back"
            className="mb-2 flex h-7 w-7 items-center justify-center rounded text-sm text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          >
            ▲
          </button>

          <div className="flex flex-1 flex-col items-center justify-center gap-1 overflow-y-auto">
            {caseFiles.map((caseFile, i) => (
              <button
                key={caseFile.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === activeIndex}
                aria-label={`Jump to ${caseFile.displayName}, item ${i + 1} of ${N}`}
                className={`flex h-7 w-7 items-center justify-center rounded text-[11px] font-medium tabular-nums transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground ${
                  i === activeIndex ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => rotateBy(1)}
            aria-label="Rotate forward"
            className="mt-2 flex h-7 w-7 items-center justify-center rounded text-sm text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          >
            ▼
          </button>
        </nav>

        <div
          role="group"
          aria-label="Case file coverflow — use arrow keys, scroll, or swipe to browse"
          tabIndex={0}
          className="flex flex-1 items-center justify-center overflow-hidden outline-none"
          style={{ perspective: `${perspective}px` }}
          ref={stageRef}
          onKeyDown={handleKeyDown}
        >
          <div
            className="relative"
            style={{ width: cardWidth, height: cardHeight, transformStyle: "preserve-3d" }}
          >
            {caseFiles.map((caseFile, i) => {
              // Two derived values from one source of truth (rotationOffsets[i]):
              // the raw, ever-growing/shrinking value drives the CSS rotation
              // itself (so transitions are always small and correctly
              // directioned); the normalized value drives visual placement
              // (position/scale/opacity all need the shortest-path angle,
              // not the raw accumulated one).
              const raw = rotationOffsets[i];
              const normalized = ((raw % 360) + 360) % 360;
              const thetaVisual = normalized > 180 ? normalized - 360 : normalized;
              const distance = shortestDelta(activeIndex, i, N);
              const abs = Math.abs(distance);
              const isFocus = distance === 0;
              const isBack = abs >= 3;

              const rad = (thetaVisual * Math.PI) / 180;
              const x = Math.sin(rad) * radius;
              const z = (Math.cos(rad) - 1) * radius;
              const t = Math.abs(thetaVisual) / 180; // 0 at Focus, 1 at the far side
              const scale = Math.max(0.35, 1 - t * 0.75);
              const opacity = Math.max(0.15, 1 - t * 0.95);
              const brightness = 1 - t * 0.55;

              return (
                <div
                  key={caseFile.slug}
                  className={`absolute inset-0 flex flex-col rounded-2xl border border-border bg-background transition-[transform,opacity,filter] duration-[480ms] ease-out motion-reduce:transition-none ${
                    isBack ? "" : "p-6 shadow-sm"
                  } ${isFocus ? "" : abs <= 2 ? "cursor-pointer" : ""}`}
                  style={{
                    // No manual z-index: it would recompute and snap to its
                    // target instantly on every state update, while the
                    // transform below animates smoothly over 480ms — that
                    // mismatch (stacking order jumping ahead of the still-
                    // mid-flight visual position) is what read as flickering.
                    // The parent's transform-style: preserve-3d lets the
                    // browser depth-sort continuously from the real,
                    // also-animating translateZ value instead.
                    transform: `translateX(${x}px) translateZ(${z}px) rotateY(${raw}deg) scale(${scale})`,
                    opacity,
                    filter: isFocus ? "none" : `brightness(${brightness})`,
                    pointerEvents: abs <= 2 ? "auto" : "none",
                    willChange: "transform",
                  }}
                  onClick={isFocus || abs > 2 ? undefined : () => goTo(i)}
                >
                  {!isBack && (
                    <>
                      {abs <= 1 && (
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      )}
                      <p className="mt-2 text-lg font-semibold">{caseFile.displayName}</p>
                      {isFocus && (
                        <>
                          <p className="mt-2 line-clamp-5 text-sm text-muted-foreground">
                            {caseFile.question}
                          </p>
                          <div className="mt-auto pt-4">
                            <CaseFileBadges caseFile={caseFile} />
                            <Link
                              href={`/projects/${caseFile.slug}`}
                              className="mt-3 inline-block text-sm font-medium underline underline-offset-4 hover:text-muted-foreground"
                            >
                              View full Case File →
                            </Link>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
