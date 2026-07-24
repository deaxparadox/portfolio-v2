"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CaseFile } from "@/lib/content/types";
import { CaseFileBadges } from "@/components/modules/case-file-badges";

// Validated geometry ratios (docs/specs/0007-project-browser-coverflow.md) —
// kept constant as the drum scales; only absolute size changes, driven by
// the stage's real measured width, not a fixed pixel constant.
const REFERENCE_CARD_WIDTH = 260;
const RADIUS_RATIO = 780 / REFERENCE_CARD_WIDTH;
const HEIGHT_RATIO = 340 / REFERENCE_CARD_WIDTH;
const PERSPECTIVE_RATIO = 1900 / REFERENCE_CARD_WIDTH;
const ANGLE_PER_CARD = 26; // degrees — angular geometry, not physical size
const MAX_VISIBLE = 3; // 3 * 26 = 78 degrees, safely under the 90-degree edge

const CARD_WIDTH_FRACTION = 0.34; // fraction of the stage's measured width
const MIN_CARD_WIDTH = 220;
const MAX_CARD_WIDTH = 420;

const WHEEL_THRESHOLD = 40;
const SWIPE_THRESHOLD = 50;

export function CaseFileBrowser({ caseFiles }: { caseFiles: CaseFile[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(REFERENCE_CARD_WIDTH);
  const N = caseFiles.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const wheelAccum = useRef(0);
  const wheelLocked = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchDelta = useRef(0);

  function step(direction: 1 | -1) {
    setActiveIndex((prev) => Math.max(0, Math.min(N - 1, prev + direction)));
  }

  function goTo(index: number) {
    setActiveIndex(Math.max(0, Math.min(N - 1, index)));
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
  const radius = cardWidth * RADIUS_RATIO;
  const perspective = cardWidth * PERSPECTIVE_RATIO;

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
        step(wheelAccum.current > 0 ? 1 : -1);
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
        step(touchDelta.current < 0 ? 1 : -1);
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
      step(1);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      step(-1);
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
            onClick={() => step(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous case file"
            className="mb-2 flex h-7 w-7 items-center justify-center rounded text-sm text-muted-foreground disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
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
            onClick={() => step(1)}
            disabled={activeIndex === N - 1}
            aria-label="Next case file"
            className="mt-2 flex h-7 w-7 items-center justify-center rounded text-sm text-muted-foreground disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
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
              const d = i - activeIndex;
              const abs = Math.abs(d);
              const isFocus = d === 0;
              if (abs > MAX_VISIBLE) {
                return (
                  <div
                    key={caseFile.slug}
                    className="pointer-events-none absolute inset-0 opacity-0"
                  />
                );
              }

              const theta = d * ANGLE_PER_CARD;
              const rad = (theta * Math.PI) / 180;
              const x = Math.sin(rad) * radius;
              const z = (Math.cos(rad) - 1) * radius;
              const scale = Math.max(0.62, 1 - abs * 0.09);
              const opacity = Math.max(0.2, 1 - abs * 0.2);

              return (
                <div
                  key={caseFile.slug}
                  className={`absolute inset-0 flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm transition-[transform,opacity,filter] duration-[420ms] ease-out motion-reduce:transition-none ${
                    isFocus ? "" : "cursor-pointer"
                  }`}
                  style={{
                    transform: `translateX(${x}px) translateZ(${z}px) rotateY(${theta}deg) scale(${scale})`,
                    opacity,
                    filter: isFocus ? "none" : `brightness(${1 - abs * 0.05})`,
                    zIndex: 100 - abs,
                    pointerEvents: "auto",
                  }}
                  onClick={isFocus ? undefined : () => goTo(i)}
                >
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-lg font-semibold">{caseFile.displayName}</p>
                  <p className="mt-2 line-clamp-5 text-sm text-muted-foreground">
                    {caseFile.question}
                  </p>
                  <div className="mt-auto pt-4">
                    <CaseFileBadges caseFile={caseFile} />
                    {isFocus && (
                      <Link
                        href={`/projects/${caseFile.slug}`}
                        className="mt-3 inline-block text-sm font-medium underline underline-offset-4 hover:text-muted-foreground"
                      >
                        View full Case File →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
