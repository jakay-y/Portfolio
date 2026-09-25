import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { ParallaxPan } from "@/components/motion/ParallaxPan";
import { BrowserFrame } from "@/components/BrowserFrame";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Slow-in/slow-out — a deliberate, cinematic reveal rather than a linear swap.
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

// Fraction of a project's own scroll segment spent arriving (the rest is dwell time).
const ARRIVAL_FRACTION = 0.7;

function segmentWindow(index: number, total: number) {
  const start = index / total;
  const end = Math.min(start + ARRIVAL_FRACTION / total, 1);
  return { start, end };
}

function ProjectFrame({ project, drift }: { project: Project; drift?: MotionValue<number> }) {
  const fit = project.deckFit === "contain" ? "object-contain" : "object-cover object-top";

  if (project.deckImage && project.deckFramed) {
    return (
      <BrowserFrame
        src={project.deckImage}
        alt={project.gallery[0]?.alt ?? project.title}
        url={project.liveUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "")}
      />
    );
  }

  if (project.parallax) {
    // ParallaxPan already provides its own motion — no extra drift layered on top.
    return (
      <ParallaxPan
        src={project.parallax.src}
        alt={project.gallery[0]?.alt ?? project.title}
        imageAspect={project.parallax.imageAspect}
        containerAspect={3 / 4}
      />
    );
  }

  const src = project.deckImage ?? project.image;
  const img = <img src={src} alt={project.gallery[0]?.alt ?? project.title} className={cn("h-full w-full", fit)} />;

  if (!drift) return img;

  // Subtle continuous drift as the page scrolls — the image lives in a box
  // slightly larger than its frame so the drift never exposes empty edges.
  return (
    <motion.div className="absolute inset-[-24px]" style={{ y: drift }}>
      {img}
    </motion.div>
  );
}

interface DeckCardProps {
  project: Project;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  drift: MotionValue<number>;
}

function DeckCard({ project, index, total, scrollYProgress, drift }: DeckCardProps) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const { start, end } = segmentWindow(index, total);
  const next = segmentWindow(index + 1, total);

  const eased = useTransform(scrollYProgress, (p) =>
    isFirst ? 1 : easeInOutCubic(clamp01((p - start) / (end - start))),
  );
  const nextEased = useTransform(scrollYProgress, (p) =>
    isLast ? 0 : easeInOutCubic(clamp01((p - next.start) / (next.end - next.start))),
  );

  const x = useTransform([eased, nextEased], (v) => {
    const [e, ne] = v as number[];
    return (1 - e) * 64 - ne * 64;
  });
  const opacity = useTransform([eased, nextEased], (v) => {
    const [e, ne] = v as number[];
    return clamp01(e - ne);
  });
  const scale = useTransform([eased, nextEased], (v) => {
    const [e, ne] = v as number[];
    return 0.94 + e * 0.06 - ne * 0.04;
  });
  const blurAmount = useTransform([eased, nextEased], (v) => {
    const [e, ne] = v as number[];
    return (1 - e) * 12 + ne * 10;
  });
  const filter = useTransform(blurAmount, (b) => `blur(${b}px)`);

  return (
    <motion.div className="absolute inset-0" style={{ zIndex: index + 1, x, opacity, scale, filter }}>
      <div
        className="h-full rounded-[28px] p-[3px]"
        style={{
          background: `linear-gradient(135deg, hsl(${project.accent} / 0.55) 0%, hsl(${project.accent} / 0.1) 45%, hsl(${project.accent} / 0.1) 55%, hsl(${project.accent} / 0.55) 100%)`,
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.35)",
        }}
      >
        <div className="h-full rounded-[25px] bg-background p-[10px]">
          <div className="relative h-full overflow-hidden rounded-[18px] bg-card ring-1 ring-black/[0.06]">
            <ProjectFrame project={project} drift={drift} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface WorkDeckProps {
  projects: Project[];
}

/** A pinned parallax carousel: a sidebar (counter, title, summary, prev/next)
 * stays fixed while the project frame on the right cross-fades — the next
 * project peeks in blurred from the edge as the current one recedes. */
export function WorkDeck({ projects }: WorkDeckProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: deckRef, offset: ["start start", "end end"] });
  const drift = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  const total = projects.length;
  const [active, setActive] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const el = deckRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const progress = range > 0 ? clamp01(-rect.top / range) : 0;
      // Switch at each card's crossfade midpoint, not its raw segment start —
      // otherwise the sidebar names the next project before its image has
      // visually caught up.
      let next = 0;
      for (let i = 1; i < total; i++) {
        const { start, end } = segmentWindow(i, total);
        if (progress >= start + (end - start) / 2) next = i;
      }
      setActive(next);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [total]);

  function goTo(index: number) {
    const el = deckRef.current;
    if (!el || index < 0 || index >= total) return;
    const range = el.offsetHeight - window.innerHeight;
    const { end } = segmentWindow(index, total);
    const next = segmentWindow(index + 1, total);
    const dwellMid = (end + (index === total - 1 ? 1 : next.start)) / 2;
    const containerTop = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: containerTop + dwellMid * range, behavior: "smooth" });
  }

  const segmentVH = 110;
  const totalHeight = `${100 + total * segmentVH}vh`;
  const activeProject = projects[active];

  return (
    <>
      {/* Desktop: pinned parallax carousel */}
      <div ref={deckRef} className="relative hidden md:block" style={{ height: totalHeight }}>
        <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-12 gap-10 px-6 md:px-12">
            <div className="col-span-5 flex flex-col justify-center">
              <span className="font-mono text-sm text-faint">
                {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-heading text-heading-lg font-semibold tracking-tight">
                {activeProject.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{activeProject.category}</p>
              <p className="mt-4 max-w-sm text-muted-foreground">{activeProject.summary}</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {activeProject.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                    {tool}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous project"
                  disabled={active === 0}
                  onClick={() => goTo(active - 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-200 hover:border-foreground disabled:opacity-30 disabled:hover:border-border"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label="Next project"
                  disabled={active === total - 1}
                  onClick={() => goTo(active + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-200 hover:border-foreground disabled:opacity-30 disabled:hover:border-border"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <Button href={`/work/${activeProject.slug}`} className="ml-2">
                  View case study
                </Button>
              </div>
            </div>

            <div className="relative col-span-7" style={{ perspective: 1800 }}>
              <div className="relative aspect-[4/3]">
                {projects.map((project, i) => (
                  <DeckCard key={project.slug} project={project} index={i} total={total} scrollYProgress={scrollYProgress} drift={drift} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: simple stacked list, no pin/parallax */}
      <div className="space-y-4xl px-6 md:hidden">
        {projects.map((project) => (
          <Link key={project.slug} to={`/work/${project.slug}`} className="group block">
            <div
              className="rounded-[24px] p-[3px]"
              style={{
                background: `linear-gradient(135deg, hsl(${project.accent} / 0.55) 0%, hsl(${project.accent} / 0.1) 45%, hsl(${project.accent} / 0.1) 55%, hsl(${project.accent} / 0.55) 100%)`,
              }}
            >
              <div className="rounded-[21px] bg-background p-[8px]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[15px] bg-card ring-1 ring-black/[0.06]">
                  <ProjectFrame project={project} />
                </div>
                <div className="px-2 pb-1 pt-4">
                  <h3 className="font-heading text-xl font-semibold tracking-tight">{project.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{project.category}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
