import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  transform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Button } from "@/components/ui/Button";
import { LiveTimeWAT } from "@/components/LiveTimeWAT";
import { useIntroDone } from "@/hooks/use-intro-done";
import { smoothScrollTo } from "@/lib/smooth-scroll";
import { motionTokens } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";
import { createHeroControls, OBJECT_FILL, SEPARATION_GAP, type HeroControls } from "./heroControls";
import { HeroCanvasLayer, HeroPoster } from "./HeroObject";
import { HERO_POSTER_SRC, loadHeroScene, useHeroPointer, useHeroSupport } from "./useHero";

const DESIGN_ITEMS = ["Brand Identity", "UI / UX Design", "Design Systems", "Prototyping in Figma"];
const BUILD_ITEMS = ["Marketing Websites", "Web Apps & Dashboards", "Full-stack Products", "React · Next.js · Supabase"];

/**
 * Scroll timeline (0–1 across the pinned stretch). Stage 1 intro · Stage 2 the split · Stage 3 the fusion.
 * Everything is scrubbed, so it plays forwards and backwards with the scroll position.
 */
const T = {
  introOut: [0.24, 0.34],
  toCenter: [0.3, 0.42],
  open: [0.34, 0.46],
  statementIn: [0.42, 0.48],
  listStart: 0.46,
  listStep: 0.035,
  craftOut: [0.62, 0.68],
  close: [0.66, 0.76],
  toFused: [0.66, 0.78],
  solidify: [0.72, 0.9],
  payoffIn: [0.84, 0.9],
};

/** Where each stage's clicked label scrolls to. */
const STAGE_STOPS = [
  { label: "Intro", at: 0 },
  { label: "Craft", at: 0.52 },
  { label: "Work", at: 0.86 },
];

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Clamped piecewise interpolation. */
function lerpAt(p: number, input: number[], output: number[], smooth = false) {
  return transform(p, input, output, smooth ? { ease: easeInOut } : undefined);
}

/** Holds `values[1]` between the two ranges: a → hold → b. */
function through(p: number, a: number[], b: number[], values: number[]) {
  return lerpAt(p, [a[0], a[1], b[0], b[1]], [values[0], values[1], values[1], values[2]], true);
}

interface Viewport {
  w: number;
  h: number;
  mobile: boolean;
}

function readViewport(): Viewport {
  return { w: window.innerWidth, h: window.innerHeight, mobile: window.innerWidth < 768 };
}

/** Anchor centre (px) and size for each stage: intro, split, fused. */
function stageLayout(v: Viewport) {
  if (v.mobile) {
    const size = [Math.min(v.w * 0.62, v.h * 0.34), Math.min(v.w * 0.4, v.h * 0.2), Math.min(v.w * 0.56, v.h * 0.3)];
    // Halves travel vertically to roughly 21% / 79% of the screen, leaving a band for the lists.
    const sepMax = (v.h * 0.29) / ((SEPARATION_GAP * size[1] * OBJECT_FILL) / 2);
    return { x: [v.w / 2, v.w / 2, v.w / 2], y: [v.h * 0.29, v.h * 0.5, v.h * 0.44], size, sepMax };
  }
  const cw = Math.min(v.w - 96, 1056);
  const left = (v.w - cw) / 2;
  const size = [Math.min(v.w * 0.4, v.h * 0.62, 560), Math.min(v.w * 0.27, v.h * 0.44), Math.min(v.w * 0.32, v.h * 0.52)];
  // sepMax 1.55 opens a gap wide enough for the statement between the halves.
  return { x: [left + cw * 0.775, v.w / 2, v.w / 2], y: [v.h * 0.53, v.h * 0.4, v.h * 0.46], size, sepMax: 1.55 };
}

function useViewport() {
  const [viewport, setViewport] = useState(readViewport);
  useEffect(() => {
    const onResize = () => setViewport(readViewport());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return viewport;
}

/** Entrance on page load: fade + 16px rise, staggered 80ms, released once the loader clears. */
function Entrance({ index, children, className }: { index: number; children: ReactNode; className?: string }) {
  const introDone = useIntroDone();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: motionTokens.duration.medium, ease: motionTokens.easing.premium, delay: index * 0.08 }}
    >
      {children}
    </motion.div>
  );
}

function ClockBadge() {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-soft-pulse rounded-full bg-accent" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      Port Harcourt · <LiveTimeWAT />
    </span>
  );
}

function IntroCopy({ onSeeWork }: { onSeeWork: () => void }) {
  return (
    <>
      <Entrance index={0}>
        <p className="font-mono text-eyebrow uppercase text-muted-foreground">Designer &amp; Engineer — Port Harcourt</p>
      </Entrance>
      <Entrance index={1}>
        <h1 className="mt-5 whitespace-nowrap font-heading text-[clamp(2.75rem,6.2vw,5.75rem)] font-medium leading-[0.95] tracking-[-0.04em]">
          Justice Nweke
        </h1>
      </Entrance>
      <Entrance index={2}>
        <p className="mt-4 font-heading text-[clamp(1.5rem,2.8vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.02em]">
          From Figma to production. <span className="whitespace-nowrap text-faint">No handoff.</span>
        </p>
      </Entrance>
      <Entrance index={3}>
        <p className="mt-5 max-w-md text-muted-foreground">
          I design and build brands, interfaces and full-stack products for founders in oil &amp; gas, fintech, healthcare and
          retail.
        </p>
      </Entrance>
      <Entrance index={4} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button onClick={onSeeWork}>See the work</Button>
        <Link to="/contact" className="group relative rounded-sm py-1 text-sm font-medium text-foreground outline-offset-4">
          Start a project →
          <span
            aria-hidden
            className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-small ease-premium group-hover:scale-x-100 group-focus-visible:scale-x-100"
          />
        </Link>
      </Entrance>
    </>
  );
}

function CapabilityList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-eyebrow uppercase text-muted-foreground">{label}</p>
      <ul className="mt-4 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="font-heading text-[1.6rem] font-medium leading-tight tracking-tight">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Reduced motion: no pinning, no scrubbing — plain stacked sections. */
function StaticHero({ onSeeWork }: { onSeeWork: () => void }) {
  return (
    <>
      <section className="px-6 pb-4xl pt-[calc(theme(spacing.section)+2rem)] md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[55fr_45fr]">
          <div>
            <IntroCopy onSeeWork={onSeeWork} />
            <div className="mt-10">
              <ClockBadge />
            </div>
          </div>
          <img src={HERO_POSTER_SRC} alt="" width={900} height={900} className="mx-auto w-full max-w-[460px]" />
        </div>
      </section>
      <section aria-label="What I do" className="border-t border-border px-6 py-section md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-display-lg font-medium">
            Two disciplines. <span className="text-faint">One pair of hands.</span>
          </h2>
          <div className="mt-3xl grid gap-3xl md:grid-cols-2">
            <CapabilityList label="Design" items={DESIGN_ITEMS} />
            <CapabilityList label="Build" items={BUILD_ITEMS} />
          </div>
        </div>
      </section>
    </>
  );
}

function ScrubItem({ progress, range, children }: { progress: MotionValue<number>; range: number[]; children: ReactNode }) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [16, 0, 0, -16]);
  return (
    <motion.li
      className="font-heading text-lg font-medium leading-snug tracking-tight md:text-[1.6rem] md:leading-tight"
      style={{ opacity, y }}
    >
      {children}
    </motion.li>
  );
}

function ScrubList({ label, items, progress, align }: { label: string; items: string[]; progress: MotionValue<number>; align: "left" | "right" | "center" }) {
  const labelOpacity = useTransform(progress, [T.listStart - 0.02, T.listStart + 0.01, T.craftOut[0], T.craftOut[1]], [0, 1, 1, 0]);
  return (
    <div className={cn(align === "right" && "text-right", align === "center" && "text-center")}>
      <motion.p className="font-mono text-eyebrow uppercase text-muted-foreground" style={{ opacity: labelOpacity }}>
        {label}
      </motion.p>
      <ul className="mt-3 space-y-1 md:mt-4 md:space-y-1.5">
        {items.map((item, i) => {
          const start = T.listStart + i * T.listStep;
          return (
            <ScrubItem key={item} progress={progress} range={[start, start + 0.03, T.craftOut[0], T.craftOut[1]]}>
              {item}
            </ScrubItem>
          );
        })}
      </ul>
    </div>
  );
}

/** The pinned, scroll-scrubbed hero: intro → the object splits into design + build → fuses → hands off to the work. */
export function HeroSequence() {
  const reduce = useReducedMotion();
  const viewport = useViewport();
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const controls = useRef<HeroControls>(createHeroControls());
  const pointer = useHeroPointer(stageRef);
  const { mode, touch } = useHeroSupport();
  const [sceneReady, setSceneReady] = useState(false);
  const introDone = useIntroDone();
  // Mount the WebGL scene only once the loader has lifted and the main thread is idle —
  // the poster is already showing, so first load never waits on three.js.
  const [mountScene, setMountScene] = useState(false);
  // Fetch + parse three.js while the loader is up (its motion runs on the compositor, so this is free).
  useEffect(() => {
    if (mode === "webgl") void loadHeroScene();
  }, [mode]);
  useEffect(() => {
    if (!introDone || mode !== "webgl") return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    // Wait for the loader's curtain to finish lifting so three.js never competes with it.
    let id = 0;
    const wait = window.setTimeout(() => {
      id = idle(() => setMountScene(true), { timeout: 1500 });
    }, 900);
    return () => {
      window.clearTimeout(wait);
      cancel(id);
    };
  }, [introDone, mode]);

  function seeWork() {
    const work = document.getElementById("work");
    if (work) smoothScrollTo(work);
  }

  // Pinned stretch → 0–1, smoothed (≈0.8s scrub). `exit` covers the section scrolling away after unpin.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0005 });
  const { scrollYProgress: exitRaw } = useScroll({ target: trackRef, offset: ["end end", "end start"] });
  const exit = useSpring(exitRaw, { stiffness: 120, damping: 30, restDelta: 0.0005 });

  // A resize bumps this tick so every layout-dependent transform recomputes.
  const layout = stageLayout(viewport);
  const layoutRef = useRef(layout);
  const tick = useMotionValue(0);
  useEffect(() => {
    layoutRef.current = stageLayout(viewport);
    tick.set(tick.get() + 1);
  }, [viewport, tick]);

  const anchorSize = useTransform(() => {
    tick.get();
    return through(progress.get(), T.toCenter, T.toFused, layoutRef.current.size) * (1 - exit.get() * 0.45);
  });
  const anchorX = useTransform(() => {
    tick.get();
    return through(progress.get(), T.toCenter, T.toFused, layoutRef.current.x) - anchorSize.get() / 2;
  });
  const anchorY = useTransform(() => {
    tick.get();
    const y = through(progress.get(), T.toCenter, T.toFused, layoutRef.current.y);
    // While the section scrolls away, counter ~70% of that motion: the object drifts up gently
    // and lingers mid-screen, so the carousel rises to meet it instead of leaving a gap.
    // (Less on phones, where the payoff line sits just below the object.)
    return y - anchorSize.get() / 2 + exit.get() * window.innerHeight * (window.innerWidth < 768 ? 0.35 : 0.7);
  });

  // Object controls follow the timeline (the render loop damps toward them).
  function syncControls() {
    const p = progress.get();
    const e = exit.get();
    const L = layoutRef.current;
    const c = controls.current;
    c.cursor = lerpAt(p, [0.24, 0.34], [1, 0]);
    c.split = lerpAt(p, [0.26, 0.4], [0.12, 0]);
    c.separation = lerpAt(p, [T.open[0], T.open[1], T.close[0], T.close[1]], [0, L.sepMax, L.sepMax, 0], true);
    c.solidity = lerpAt(p, T.solidify, [0, 1], true);
    c.axis = window.innerWidth < 768 ? lerpAt(p, [0.28, 0.4], [0, 1]) : 0;
    // Fades across most of the unpin so the first carousel card arrives while it is still visible.
    c.opacity = 1 - lerpAt(e, [0.2, 0.8], [0, 1]);
  }
  useMotionValueEvent(progress, "change", syncControls);
  useMotionValueEvent(exit, "change", syncControls);
  useEffect(syncControls);

  // Stage 1 copy + scroll cue.
  const introOpacity = useTransform(progress, T.introOut, [1, 0]);
  const introY = useTransform(progress, T.introOut, [0, -48]);
  const cueOpacity = useTransform(progress, [0, 0.02], [1, 0]);
  // Stage 2 statement.
  const statementRange = [T.statementIn[0], T.statementIn[1], T.craftOut[0], T.craftOut[1]];
  const statementOpacity = useTransform(progress, statementRange, [0, 1, 1, 0]);
  const statementY = useTransform(progress, statementRange, [20, 0, 0, -24]);
  // Stage 3 payoff line.
  // Gone early in the unpin, before the object can drift across it.
  const payoffOpacity = useTransform(() => lerpAt(progress.get(), T.payoffIn, [0, 1]) * (1 - lerpAt(exit.get(), [0, 0.15], [0, 1])));
  const payoffY = useTransform(progress, T.payoffIn, [16, 0]);
  // Shared contact shadow: widens as the halves part (desktop), steps aside for vertical halves (mobile), fades on exit.
  const shadowSpread = useTransform(() => 1 + lerpAt(progress.get(), [T.open[0], T.open[1], T.close[0], T.close[1]], [0, 1, 1, 0]) * 0.6);
  const shadowOpacity = useTransform(() => {
    const out = 1 - lerpAt(exit.get(), [0, 0.5], [0, 1]);
    return viewport.mobile ? out * (1 - lerpAt(progress.get(), [0.34, 0.42, 0.66, 0.74], [0, 1, 1, 0])) : out;
  });
  // The static poster can't split — in poster mode it steps aside while the halves would be apart.
  const posterOpacity = useTransform(() => (mode === "poster" ? 1 - lerpAt(progress.get(), [0.34, 0.42, 0.68, 0.76], [0, 1, 1, 0]) : 1));
  // Progress rail: hidden once the section unpins.
  const railOpacity = useTransform(exit, [0, 0.05], [1, 0]);
  const [stage, setStage] = useState(0);
  useMotionValueEvent(progress, "change", (p) => setStage(p < 0.36 ? 0 : p < 0.7 ? 1 : 2));

  // Stage 2 columns sit under each half; the statement sits in the gap between them.
  const half = (layout.size[1] * OBJECT_FILL) / 2;
  const columnX = layout.sepMax * SEPARATION_GAP * half + half / 2;
  const listTop = layout.y[1] + half * 0.95 + 28;

  function jumpTo(at: number) {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(top + at * (el.offsetHeight - window.innerHeight));
  }

  if (reduce) return <StaticHero onSeeWork={seeWork} />;

  return (
    <section ref={trackRef} aria-label="Introduction" className="relative" style={{ height: viewport.mobile ? "220vh" : "300vh" }}>
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        {mountScene && (
          <HeroCanvasLayer controls={controls} pointer={pointer} anchor={anchorRef} touch={touch} onReady={() => setSceneReady(true)} />
        )}

        {/* Object anchor — the poster lives here and the live scene tracks this box. */}
        <motion.div
          ref={anchorRef}
          className="pointer-events-none absolute left-0 top-0"
          style={{ x: anchorX, y: anchorY, width: anchorSize, height: anchorSize, opacity: posterOpacity }}
        >
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={introDone ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: motionTokens.duration.large, ease: motionTokens.easing.premium, delay: 0.1 }}
          >
            <HeroPoster hidden={mode === "webgl" && sceneReady} spread={shadowSpread} shadowOpacity={shadowOpacity} />
          </motion.div>
        </motion.div>

        {/* Stage 1 — intro copy */}
        <motion.div className="absolute inset-0" style={{ opacity: introOpacity, y: introY }}>
          <div
            className={cn(
              "mx-auto grid h-full max-w-6xl px-6 md:grid-cols-[55fr_45fr] md:items-center md:px-12",
              viewport.mobile && "content-end pb-24",
            )}
          >
            <div>
              <IntroCopy onSeeWork={seeWork} />
            </div>
          </div>
        </motion.div>

        {/* Stage 2 — statement in the gap, capabilities under each half */}
        <div
          className="pointer-events-none absolute left-1/2 w-[min(26vw,22rem)] -translate-x-1/2 text-center max-md:w-[80vw]"
          style={{ top: viewport.mobile ? viewport.h * 0.285 : layout.y[1] - 64 }}
        >
          <motion.h2
            className="font-heading text-[clamp(1.6rem,2.4vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.03em]"
            style={{ opacity: statementOpacity, y: statementY }}
          >
            Two disciplines.
            <br />
            <span className="text-faint">One pair of hands.</span>
          </motion.h2>
        </div>
        {viewport.mobile ? (
          <div className="pointer-events-none absolute inset-x-6 grid grid-cols-2 gap-5" style={{ top: viewport.h * 0.42 }}>
            <ScrubList label="Design" items={DESIGN_ITEMS} progress={progress} align="left" />
            <ScrubList label="Build" items={BUILD_ITEMS} progress={progress} align="right" />
          </div>
        ) : (
          <>
            <div className="pointer-events-none absolute w-[20rem]" style={{ left: viewport.w / 2 - columnX - 160, top: listTop }}>
              <ScrubList label="Design" items={DESIGN_ITEMS} progress={progress} align="center" />
            </div>
            <div className="pointer-events-none absolute w-[20rem]" style={{ left: viewport.w / 2 + columnX - 160, top: listTop }}>
              <ScrubList label="Build" items={BUILD_ITEMS} progress={progress} align="center" />
            </div>
          </>
        )}

        {/* Stage 3 — payoff */}
        <motion.p
          className="pointer-events-none absolute inset-x-6 text-center font-heading text-[clamp(1.25rem,2vw,1.75rem)] font-medium tracking-[-0.02em]"
          style={{ top: layout.y[2] + layout.size[2] * 0.46 + 12, opacity: payoffOpacity, y: payoffY }}
        >
          Here’s what that looks like.
        </motion.p>

        {/* Bottom cues */}
        <motion.div className="absolute bottom-6 left-6 md:bottom-8 md:left-12" style={{ opacity: introOpacity }}>
          <Entrance index={5}>
            <ClockBadge />
          </Entrance>
        </motion.div>
        <motion.div className="absolute bottom-8 left-0 right-0 flex justify-center max-md:hidden" style={{ opacity: cueOpacity }}>
          <Entrance index={6} className="flex flex-col items-center gap-2">
            <span className="relative block h-10 w-px overflow-hidden bg-foreground/15">
              <span className="absolute -left-[2.5px] top-0 h-1.5 w-1.5 animate-scroll-cue rounded-full bg-foreground" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Scroll</span>
          </Entrance>
        </motion.div>

        {/* Progress rail */}
        <motion.nav
          aria-label="Introduction progress"
          className="absolute bottom-0 right-8 top-0 flex items-center max-md:hidden"
          style={{ opacity: railOpacity }}
        >
          <div className="flex items-stretch gap-3">
            <ol className="flex flex-col justify-between gap-6 py-0.5 text-right">
              {STAGE_STOPS.map((s, i) => (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() => jumpTo(s.at)}
                    aria-current={stage === i ? "step" : undefined}
                    className={cn(
                      "rounded-sm font-mono text-[10px] uppercase tracking-[0.2em] outline-offset-4 transition-colors duration-small ease-premium hover:text-foreground",
                      stage === i ? "text-foreground" : "text-faint",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")} {s.label}
                  </button>
                </li>
              ))}
            </ol>
            <span className="relative w-px overflow-hidden bg-foreground/10">
              <motion.span className="absolute inset-0 origin-top bg-foreground" style={{ scaleY: progress }} />
            </span>
          </div>
        </motion.nav>
      </div>
    </section>
  );
}
