import { useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Link } from "react-router-dom";
import type { Project } from "@/data/projects";
import { ParallaxPan } from "@/components/motion/ParallaxPan";
import { BrowserFrame } from "@/components/BrowserFrame";
import { useSpringValue } from "@/hooks/use-spring-value";

// Slow-in/slow-out — a deliberate, cinematic reveal rather than a linear swap.
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface DeckCardProps {
  project: Project;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  onHoverChange: (hovering: boolean) => void;
}

// Fraction of this card's own scroll segment spent sliding in (the rest is
// dwell time once it's settled). Larger = more scroll runway per transition
// = slower perceived speed.
const ARRIVAL_FRACTION = 0.7;

function DeckCard({ project, index, total, scrollYProgress, onHoverChange }: DeckCardProps) {
  const isFirst = index === 0;
  const start = index / total;
  const end = Math.min(start + (ARRIVAL_FRACTION / total), 1);

  // Each card lives in its own slice of the shared scroll progress: idle at
  // x:100% (off to the right) until its slice begins, slides to x:0% across
  // it, then stays put — covering whatever's beneath — for the rest of the
  // scroll. Nothing here depends on this card's own DOM position, so the
  // card beneath never has to "un-pin" to be covered; it just sits still.
  // The raw scroll fraction is run through an easeInOutCubic curve before
  // driving any output, so the reveal eases in and out instead of tracking
  // scroll linearly.
  const eased = useTransform(scrollYProgress, (p) => {
    const t = Math.min(Math.max((p - start) / (end - start), 0), 1);
    return easeInOutCubic(t);
  });
  const xRaw = useTransform(eased, [0, 1], ["100%", "0%"]);
  const rotateYRaw = useTransform(eased, [0, 1], [26, 0]);
  const scaleRaw = useTransform(eased, [0, 1], [0.92, 1]);
  const shadowRaw = useTransform(eased, [0, 1], [0.5, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center px-6 md:px-12"
      style={{
        zIndex: index + 1,
        x: isFirst ? "0%" : xRaw,
        rotateY: isFirst ? 0 : rotateYRaw,
        scale: isFirst ? 1 : scaleRaw,
        transformPerspective: 1800,
      }}
    >
      <div className="relative mx-auto w-full max-w-5xl">
        {!isFirst && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[48px] bg-black blur-3xl"
            style={{ opacity: shadowRaw }}
          />
        )}
        <Link
          to={`/work/${project.slug}`}
          className="group block md:hover:cursor-none"
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
        >
          <div
            className="rounded-[28px] p-[3px] transition-[padding] duration-500 ease-smooth group-hover:p-[5px]"
            style={{
              background: `linear-gradient(135deg, hsl(${project.accent} / 0.55) 0%, hsl(${project.accent} / 0.1) 45%, hsl(${project.accent} / 0.1) 55%, hsl(${project.accent} / 0.55) 100%)`,
              boxShadow: "0 40px 80px -30px rgba(0,0,0,0.35)",
            }}
          >
            <div className="rounded-[25px] bg-background p-[10px]">
              {/* Every card shares this exact box — same aspect, padding, and
               * radius no matter what's inside. Content that doesn't natively
               * fit (e.g. a two-phone composite) is scaled down via
               * object-contain rather than changing the box itself. */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-card ring-1 ring-black/[0.06] sm:aspect-[16/8]">
                {project.deckImage && project.deckFramed ? (
                  <BrowserFrame
                    src={project.deckImage}
                    alt={project.gallery[0]?.alt ?? project.title}
                    url={project.liveUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  />
                ) : project.deckImage ? (
                  <img
                    src={project.deckImage}
                    alt={project.gallery[0]?.alt ?? project.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    className={
                      project.deckFit === "contain"
                        ? "h-full w-full object-contain"
                        : "h-full w-full object-cover object-top"
                    }
                  />
                ) : project.parallax ? (
                  <ParallaxPan
                    src={project.parallax.src}
                    alt={project.gallery[0]?.alt ?? project.title}
                    imageAspect={project.parallax.imageAspect}
                    containerAspect={8 / 16}
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.gallery[0]?.alt ?? project.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    className={
                      project.deckFit === "contain"
                        ? "h-full w-full object-contain"
                        : "h-full w-full object-cover object-top"
                    }
                  />
                )}
              </div>

              <div className="flex flex-wrap items-end justify-between gap-4 px-2 pb-1 pt-5 sm:px-4">
                <div>
                  <h3 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{project.category}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

interface WorkDeckProps {
  projects: Project[];
}

/** A horizontal card-stack: as you scroll, each project slides in from the
 * right and covers the last, which stays pinned in place underneath. */
export function WorkDeck({ projects }: WorkDeckProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: deckRef, offset: ["start start", "end end"] });

  const [hovered, setHovered] = useState<{ src: string; alt: string } | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const cursorSpring = useSpringValue(mouse.x, mouse.y, { stiffness: 280, damping: 26 });

  // More runway per card = more scroll distance mapped to each transition =
  // slower, more deliberate perceived speed.
  const segmentVH = 130;
  const totalHeight = `${100 + projects.length * segmentVH}vh`;

  return (
    <div
      ref={deckRef}
      className="relative"
      style={{ height: totalHeight }}
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden" style={{ perspective: 1800 }}>
        {projects.map((project, i) => (
          <DeckCard
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
            scrollYProgress={scrollYProgress}
            onHoverChange={(hovering) =>
              setHovered(hovering ? { src: project.deckImage ?? project.image, alt: project.title } : null)
            }
          />
        ))}
      </div>

      {/* Image-preview cursor: replaces the pointer with a floating thumbnail
       * of the hovered project, spring-tracked. The only custom cursor on the site. */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-[120px] w-[180px] overflow-hidden rounded-2xl shadow-[0_25px_50px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/10 transition-opacity duration-200 ease-smooth md:block"
        style={{
          transform: `translate3d(${cursorSpring.x + 24}px, ${cursorSpring.y - 60}px, 0) scale(${hovered ? 1 : 0.85})`,
          opacity: hovered ? 1 : 0,
        }}
      >
        {hovered && <img src={hovered.src} alt={hovered.alt} className="h-full w-full object-cover object-top" />}
      </div>
    </div>
  );
}
