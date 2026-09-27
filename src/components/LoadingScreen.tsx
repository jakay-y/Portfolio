import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import stackRender from "@/assets/loader-stack.webp";
import { markIntroDone } from "@/hooks/use-intro-done";
import { pauseSmoothScroll } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

/** Warm stone ground taken from the Imagine render's studio backdrop. */
const LOADER_BG = "#eeeae1";
/** The counter runs 000→100 in one continuous sweep over this span; the whole loader lasts ≈4.5s. */
const COUNT_MS = 3000;
/** Upper bound on waiting for slow assets — the page keeps loading behind the curtain. */
const MAX_WAIT_MS = 3000;
/** Into the 1.1s curtain lift — hero text starts rising just as it's uncovered. */
const INTRO_RELEASE_MS = 550;

/** Resolves once the window, webfonts, and the hero render are all ready. */
function whenPageReady(): Promise<void> {
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
  const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
  const img = new Image();
  img.src = stackRender;
  const render = img.decode().catch(() => undefined);
  const ready = Promise.all([loaded, fonts, render]).then(() => undefined);
  // Never hold the visitor hostage to a slow asset — the page streams in behind the curtain anyway.
  const cap = new Promise<void>((resolve) => setTimeout(resolve, MAX_WAIT_MS));
  return Promise.race([ready, cap]);
}

/** Length of the curtain lift (+ its 0.1s delay) — keep in step with the `loader-curtain` keyframes. */
const CURTAIN_MS = 1200;
/** Lets the initial page mount settle before the counter starts moving. */
const COUNT_DELAY_MS = 350;

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const reduce = useReducedMotion();

  const progress = useMotionValue(0);
  const count = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));

  // Pointer-driven 3D tilt on the render.
  const tiltX = useSpring(0, { stiffness: 120, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 18 });
  const stageRef = useRef<HTMLDivElement>(null);

  // Hand off from the static cover in index.html (same colour, so the swap is invisible).
  useEffect(() => {
    document.getElementById("boot-cover")?.remove();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    pauseSmoothScroll(true);

    let cancelled = false;
    const timers: number[] = [];
    // One continuous sweep 000→100 (no stop-and-go), in parallel with the page getting ready.
    const counting = animate(progress, 100, {
      duration: reduce ? 0.3 : COUNT_MS / 1000,
      delay: reduce ? 0 : COUNT_DELAY_MS / 1000,
      ease: [0.37, 0, 0.63, 1],
    });

    Promise.all([counting, whenPageReady()]).then(async () => {
      if (cancelled) return;
      // Let 100 register for a beat before the curtain moves.
      await new Promise((r) => setTimeout(r, reduce ? 0 : 400));
      if (cancelled) return;
      setExiting(true);
      // Release entrance animations once the curtain has cleared most of the hero.
      // Deliberately never cleared: content must not stay hidden.
      setTimeout(markIntroDone, reduce ? 0 : INTRO_RELEASE_MS);
      timers.push(window.setTimeout(() => setVisible(false), reduce ? 300 : CURTAIN_MS));
    });

    return () => {
      cancelled = true;
      counting.stop();
      timers.forEach(clearTimeout);
      root.style.overflow = prevOverflow;
      pauseSmoothScroll(false);
    };
  }, [visible, progress, reduce]);

  function handlePointerMove(e: React.PointerEvent) {
    if (reduce || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * 16);
    tiltX.set(-py * 16);
  }

  if (!visible) return null;

  // All loader motion runs as CSS keyframes (compositor thread), so it stays smooth
  // even while the page mounts and loads behind the curtain. Only the counter text is JS.
  const anim = (enter: string, exit: string) => (reduce ? "" : exiting ? exit : enter);

  return (
    <div
      role="progressbar"
      aria-label="Loading portfolio"
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col overflow-hidden will-change-transform",
        exiting && (reduce ? "opacity-0 transition-opacity duration-small" : "animate-loader-curtain"),
      )}
      style={{ backgroundColor: LOADER_BG }}
      onPointerMove={handlePointerMove}
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-6 pt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/60 md:px-10 md:pt-8">
        <span>JN — Portfolio</span>
        <span className="hidden sm:inline">Port Harcourt · Worldwide</span>
      </div>

      {/* 3D stage */}
      <div ref={stageRef} className="relative flex flex-1 items-center justify-center" style={{ perspective: 1200 }}>
        <div
          className={cn(
            "relative flex w-[clamp(160px,21vw,290px)] flex-col items-center",
            anim("animate-loader-object-in", "animate-loader-object-out"),
          )}
        >
          <motion.div className="w-full" style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}>
            <img
              src={stackRender}
              alt=""
              draggable={false}
              className={cn("block h-auto w-full select-none", !reduce && "animate-loader-float")}
            />
          </motion.div>
          {/* Contact shadow — tightens and fades as the stack lifts. */}
          <div
            aria-hidden
            className={cn("mt-5 h-5 w-[78%] rounded-[50%] bg-foreground/25 blur-[10px]", !reduce && "animate-loader-shadow")}
          />
        </div>
      </div>

      {/* Bottom row: name + counter */}
      <div className="flex items-end justify-between gap-6 px-6 pb-8 md:px-10 md:pb-10">
        <div className="overflow-hidden">
          <p
            className={cn(
              "font-heading text-[clamp(1.75rem,4.5vw,3.25rem)] font-medium leading-[0.95] tracking-[-0.03em] text-foreground",
              anim("animate-loader-text-in", "animate-loader-text-out"),
            )}
          >
            Justice Nweke
          </p>
          <p className={cn("mt-2 text-sm text-foreground/60", anim("animate-loader-fade-in", "animate-loader-fade-out"))}>
            Product &amp; Brand Designer
          </p>
        </div>
        <motion.span
          aria-hidden
          className={cn(
            "font-mono text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-none tabular-nums tracking-[-0.04em] text-foreground",
            exiting && !reduce && "animate-loader-fade-out",
          )}
        >
          {count}
        </motion.span>
      </div>

      {/* Hairline progress — the same sweep as the counter, as a compositor animation. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-foreground/10">
        <div
          className={cn("h-full origin-left bg-accent", !reduce && "animate-loader-bar")}
          style={{
            animationDuration: `${COUNT_MS}ms`,
            animationDelay: `${COUNT_DELAY_MS}ms`,
            transform: reduce ? "scaleX(1)" : undefined,
          }}
        />
      </div>
    </div>
  );
}
