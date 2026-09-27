import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectFrame } from "@/components/ProjectFrame";
import { Button } from "@/components/ui/Button";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion-tokens";
import { smoothScrollTo } from "@/lib/smooth-scroll";
import { getLastProjectSlug, isInstantRouteSwap, navigateWithTransition, projectTransitionName, setLastProjectSlug } from "@/lib/view-transition";

const EASE_OUT = motionTokens.easing.premium;
/** Card spacing as a share of card width. */
const STEP = 0.58;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/** The image a project's carousel card shows — used to warm the cache for neighbours. */
function previewSrc(project: Project) {
  if (project.deckImage) return project.deckImage;
  if (project.parallax) return project.parallax.src;
  return project.image;
}

interface CarouselCardProps {
  project: Project;
  index: number;
  position: MotionValue<number>;
  isActive: boolean;
  reduce: boolean;
  onSelect: (index: number) => void;
  onOpen: (project: Project) => void;
}

function CarouselCard({ project, index, position, isActive, reduce, onSelect, onOpen }: CarouselCardProps) {
  // Signed distance from the front of the carousel: 0 = facing you, ±1 = neighbours.
  const d = useTransform(position, (v) => index - v);

  const x = useTransform(d, (v) => `${v * STEP * 100}%`);
  const z = useTransform(d, (v) => -Math.min(Math.abs(v), 3) * 240);
  const rotateY = useTransform(d, (v) => (reduce ? 0 : clamp(v, -1.6, 1.6) * -34));
  const opacity = useTransform(d, (v) => 1 - clamp(Math.abs(v) - 1.3, 0, 1));
  const zIndex = useTransform(d, (v) => 100 - Math.round(Math.abs(v) * 10));
  const pointerEvents = useTransform(d, (v) => (Math.abs(v) > 2 ? "none" : "auto"));
  const filter = useTransform(d, (v) => {
    if (reduce) return "none";
    const depth = Math.min(Math.abs(v), 2);
    return `blur(${depth * 2.5}px) brightness(${1 - depth * 0.05})`;
  });
  // Inner parallax: the screenshot slides against the card's own motion.
  const shift = useTransform(d, (v) => `${clamp(v, -2, 2) * -5}%`);
  const shadowOpacity = useTransform(d, (v) => 0.5 - Math.min(Math.abs(v), 1.5) * 0.25);
  const name = projectTransitionName(project.slug);

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    if (isActive) onOpen(project);
    else onSelect(index);
  }

  return (
    // Each card carries its own perspective and the stage stays flat, so cards stack strictly by
    // zIndex — overlapping neighbours never slice through each other mid-transition.
    <motion.div
      className="absolute inset-0"
      style={{ x, z, rotateY, opacity, zIndex, filter, pointerEvents, transformPerspective: 1600 }}
    >
      {/* Floor shadow — reads the card as an object standing on a surface. */}
      <motion.div
        aria-hidden
        className="absolute -bottom-12 left-[12%] h-10 w-[76%] rounded-[50%] bg-foreground blur-2xl"
        style={{ opacity: shadowOpacity }}
      />
      <a
        href={`/work/${project.slug}`}
        draggable={false}
        onClick={handleClick}
        aria-label={isActive ? `${project.title} — view case study` : `Show ${project.title}`}
        tabIndex={isActive ? 0 : -1}
        className="group relative block h-full rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div
          className={cn(
            "h-full rounded-[28px] p-[3px] transition-transform duration-medium ease-premium",
            isActive && "group-hover:-translate-y-1.5",
          )}
          style={{
            background: `linear-gradient(135deg, hsl(${project.accent} / 0.55) 0%, hsl(${project.accent} / 0.1) 45%, hsl(${project.accent} / 0.1) 55%, hsl(${project.accent} / 0.55) 100%)`,
            boxShadow: "0 50px 90px -40px rgba(0,0,0,0.45)",
          }}
        >
          <div className="h-full rounded-[25px] bg-background p-[10px]">
            <div
              className="relative h-full overflow-hidden rounded-[18px] bg-card ring-1 ring-black/[0.06]"
              // Only the front card carries the shared name — names must be unique on the page.
              style={isActive ? { viewTransitionName: name } : undefined}
              data-vt={isActive ? name : undefined}
            >
              <ProjectFrame project={project} shift={shift} />
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

function BackdropTitle({ title, index, position }: { title: string; index: number; position: MotionValue<number> }) {
  // Moves slower than the cards (≈30vw per project vs the cards' wider sweep) — the far parallax layer.
  const x = useTransform(position, (v) => `${(index - v) * 30}vw`);
  const opacity = useTransform(position, (v) => 1 - clamp(Math.abs(index - v), 0, 1));
  // Centred by the flex wrapper, not a translate — Motion's `x` would override a CSS transform.
  return (
    <div className="absolute inset-0 flex items-center justify-center pb-[12vh]">
      <motion.span
        className="whitespace-nowrap font-heading text-[clamp(5rem,17vw,15rem)] font-semibold leading-none tracking-[-0.05em] text-foreground/[0.05]"
        style={{ x, opacity }}
      >
        {title}
      </motion.span>
    </div>
  );
}

function ProgressSegment({ index, position }: { index: number; position: MotionValue<number> }) {
  // Segment i fills as the carousel travels from project i-1 to project i.
  const scaleX = useTransform(position, (v) => clamp(v - index + 1, 0, 1));
  return (
    <span className="h-px flex-1 overflow-hidden bg-foreground/10">
      <motion.span className="block h-full origin-left bg-foreground" style={{ scaleX }} />
    </span>
  );
}

function ArrowButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const pull = useMagnetic(ref, 6);
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      style={{ transform: `translate(${pull.x}px, ${pull.y}px)` }}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition-colors duration-small hover:border-foreground hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:opacity-30 disabled:hover:border-border"
    >
      {children}
    </button>
  );
}

interface ProjectCarousel3DProps {
  projects: Project[];
}

/** Scroll distance (in vh) spent travelling from one project to the next. */
const SEGMENT_VH = 95;
/** Extra resting room before the first and after the last project, in project units. */
const EDGE_PAD = 0.35;
/** Share of each segment held at rest on either side, so every project settles before the next moves. */
const DWELL = 0.2;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Maps pinned scroll progress (0–1) to a carousel position (0 … total-1) with a rest at each project. */
function toPosition(progress: number, total: number) {
  const span = total - 1;
  if (span <= 0) return 0;
  const x = clamp(progress * (span + 2 * EDGE_PAD) - EDGE_PAD, 0, span);
  const i = Math.min(Math.floor(x), span - 1);
  const t = clamp((x - i - DWELL) / (1 - 2 * DWELL), 0, 1);
  return i + easeInOutCubic(t);
}

/** Inverse of toPosition at a resting point — the scroll progress that centres `index`. */
function progressFor(index: number, total: number) {
  const span = total - 1;
  return span <= 0 ? 0 : (index + EDGE_PAD) / (span + 2 * EDGE_PAD);
}

/** A pinned, scroll-driven 3D coverflow: the section holds while scrolling turns the carousel,
 * each project resting front-and-centre before the next glides in, with layered parallax and a
 * shared-element hand-off into each case study. */
export function ProjectCarousel3D({ projects }: ProjectCarousel3DProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { hash } = useLocation();
  const reduce = useReducedMotion() ?? false;
  const total = projects.length;

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const rawPosition = useTransform(scrollYProgress, (p) => toPosition(p, total));
  const position = useSpring(rawPosition, { stiffness: 170, damping: 30, mass: 0.5 });

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  useMotionValueEvent(position, "change", (v) => {
    const next = clamp(Math.round(v), 0, total - 1);
    activeRef.current = next;
    setActive((prev) => (prev === next ? prev : next));
  });

  function scrollTopFor(index: number) {
    const el = trackRef.current;
    if (!el) return 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return top + progressFor(index, total) * (el.offsetHeight - window.innerHeight);
  }

  function goTo(index: number) {
    if (index < 0 || index >= total) return;
    smoothScrollTo(scrollTopFor(index));
  }

  // "/#work" (nav, or returning from a case study) lands on the last-opened project.
  useLayoutEffect(() => {
    if (hash !== "#work") return;
    const index = Math.max(0, projects.findIndex((p) => p.slug === getLastProjectSlug()));
    if (isInstantRouteSwap()) {
      // Jump before the view-transition snapshot so the card can morph in place.
      smoothScrollTo(scrollTopFor(index), { immediate: true });
      position.jump(index);
      return;
    }
    const id = requestAnimationFrame(() => smoothScrollTo(scrollTopFor(index)));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  // Keyboard: arrows step through the projects while the carousel is on screen.
  const inView = useInView(trackRef);
  useEffect(() => {
    if (!inView) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      e.preventDefault();
      goTo(activeRef.current + (e.key === "ArrowRight" ? 1 : -1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Warm the cache for the neighbours of the active project.
  useEffect(() => {
    for (const i of [active - 1, active + 1]) {
      const p = projects[i];
      if (p) new Image().src = previewSrc(p);
    }
  }, [active, projects]);

  // Entry blend: the stage rises from a laid-back plane as the section scrolls into view.
  const { scrollYProgress: entry } = useScroll({ target: trackRef, offset: ["start end", "start start"] });
  const entryTilt = useTransform(entry, [0, 1], reduce ? [0, 0] : [24, 0]);
  const stageScale = useTransform(entry, [0, 1], reduce ? [1, 1] : [0.88, 1]);
  const stageOpacity = useTransform(entry, [0.05, 0.3], [0, 1]);

  // Pointer tilt adds a touch of depth to the whole stage.
  const tiltX = useSpring(0, { stiffness: 90, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 90, damping: 18 });
  const rotateX = useTransform(() => entryTilt.get() + tiltX.get());

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - rect.left) / rect.width - 0.5) * 7);
    tiltX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 5);
  }

  function openCaseStudy(project: Project) {
    setLastProjectSlug(project.slug);
    navigateWithTransition(() => navigate(`/work/${project.slug}`), projectTransitionName(project.slug));
  }

  const current = projects[active];

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `${100 + (total - 1) * SEGMENT_VH + EDGE_PAD * 2 * SEGMENT_VH}vh` }}
      aria-roledescription="carousel"
      aria-label="Selected work"
    >
      <div
        className="sticky top-0 flex h-[100svh] flex-col overflow-hidden"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          tiltX.set(0);
          tiltY.set(0);
        }}
      >
        {/* Accent glow — crossfades between projects so the colour shift blends rather than cuts. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={current.slug}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(55% 45% at 50% 42%, hsl(${current.accent} / 0.13), transparent 72%)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.large, ease: EASE_OUT }}
          />
        </AnimatePresence>

        {/* Far parallax layer */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {projects.map((p, i) => (
            <BackdropTitle key={p.slug} title={p.title} index={i} position={position} />
          ))}
        </div>

        {/* 3D stage */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center pt-24" style={{ perspective: 1600 }}>
          <motion.div
            className="carousel-card-w relative aspect-[4/3]"
            style={{ rotateX, rotateY: tiltY, scale: stageScale, opacity: stageOpacity }}
          >
            {projects.map((project, i) => (
              <CarouselCard
                key={project.slug}
                project={project}
                index={i}
                position={position}
                isActive={i === active}
                reduce={reduce}
                onSelect={goTo}
                onOpen={openCaseStudy}
              />
            ))}
          </motion.div>
        </div>

        {/* Info bar */}
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-8 pt-10 md:px-12 md:pb-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-h-[7.5rem] md:min-h-[6.5rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: motionTokens.duration.small, ease: EASE_OUT }}
                >
                  <span className="font-mono text-sm text-faint">
                    {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-heading text-heading-lg font-semibold tracking-tight">{current.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{current.category}</p>
                  <p className="mt-2 hidden max-w-md text-sm text-muted-foreground md:line-clamp-2">{current.summary}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <ArrowButton label="Previous project" disabled={active === 0} onClick={() => goTo(active - 1)}>
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              </ArrowButton>
              <ArrowButton label="Next project" disabled={active === total - 1} onClick={() => goTo(active + 1)}>
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </ArrowButton>
              <Button
                href={`/work/${current.slug}`}
                className="ml-1"
                onClick={(e) => {
                  e.preventDefault();
                  openCaseStudy(current);
                }}
              >
                View case study
              </Button>
            </div>
          </div>

          {/* Progress — one segment per project, filling as you scroll through them. */}
          <div className="mt-6 flex gap-2" aria-hidden>
            {projects.map((p, i) => (
              <ProgressSegment key={p.slug} index={i} position={position} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
